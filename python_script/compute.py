import sys, json
import numpy as np
import scipy as sp
from scipy import stats
import random
import math

np.set_printoptions(suppress=True)

lo_freq = 10
hi_freq = 10000
offset = 100
max_sec = 30

# population
pop_size = 100

'''
 frequency: 10 < f < 5000 Hz
 ampli: 0 < a < 1
 phase: 0 < phi < 100
 
 
arrays like:
 [
    [freq_x, amp_x, phase_x], 
    [freq_y, amp_y, phase_y], 
    [freq_z, amp_z, phase_z]
    
    ]'''

# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def main():
    # get our data as an array from read_in()
    lines = read_in()
    likeX = []
    
    # create a numpy array to store likes
    np_lines = np.array(lines)
    if np_lines.size != 0:
        for element in np_lines[0]:
            element[0] = math.log10(element[0] * 100)
            
        likeX = np_lines
        population = []

        # population
        for i in range(pop_size):
            # samples drawn from uniform distribution
            population.append(np.random.uniform(0, 1, (3,3)))

        for citizen in population:
            for dna in citizen:
                #rescaling the frequency range of the population -- it's the logarithm already! 10^1 < f < 10^4
                dna[0] = np.random.uniform(np.log10(20), np.log10(5000), 1)
                # amplitude range stays the same
                dna[1] = np.random.uniform(0, 0.1, 1)
                # phase/offset range
                dna[2] = dna[2] * 100


        # COMPUTING THE UNIQUE LIKES and assigning the count
        s_like,_,_ = np.shape(likeX)
        likeX = np.reshape(likeX, (s_like,9))
        uniqueLikes, count = np.unique(likeX, axis=0, return_counts=True)
        
        #FIRST GENERATION

        # FITNESS - returns prob distribution and fitness matrix
        def evaluate_fitness(pop):
            fitness = []

            for l_index, like in enumerate(uniqueLikes):
                for c_index, citizen in enumerate(pop):
                    citizen = np.reshape(citizen, (9,))
                    sq_diff = like - citizen
                    sq_diff = sq_diff**2
                    # if there are more likes for a single shape
                    if count[l_index] > 1:
                        sq_diff = sq_diff / count[l_index]
                    # sums of the squared errors
                    summy = np.sum(sq_diff)
                    summy = 1/summy
                    # fitness : citizen index, like index, squared sum
                    fitness.append(np.array((c_index, l_index, summy)))

            # fitness array dimensions is: (population x unique likes) x 3
            fitness = np.reshape(fitness, (len(pop)*len(uniqueLikes),3))

            _,_,total_s = np.sum(fitness, axis=0)

            # creates index axis for prob distribution
            fit_index = np.arange(len(fitness))
            # prob axis
            fit_prob = []

            for index, elem in enumerate(fitness):
                # normalising
                elem[2] = elem[2]/total_s
                fit_prob.append(elem[2])

            # creates the probability density function
            new_generation_distrib = sp.stats.rv_discrete(name='first_gen', values=(fit_index, fit_prob))

            #plot of the distribution
            #plt.plot(fit_index, fit_prob)
            #plt.show()

            return new_generation_distrib, fitness

        first_generation, fitness = evaluate_fitness(population)

        #initialize to zero
        tot_sec_gen = 0

        def performance(pop, distribution):
            # sets to zero every time a new generation is performed
            global tot_sec_gen
            tot_sec_gen = 0
            we_survived = []

            def iterate():
                # from 1 to 7 seconds
                global tot_sec_gen
                time = int(np.random.uniform(1, 7, 1))
                tot_sec_gen += time
                if tot_sec_gen == 30:
                    tot_sec_gen = 0
                    survival = pop[int(fitness[distribution.rvs(size=1)][0][0])]
                    we_survived.append(survival)
                    # reset frequency to normal scale (linear, f/100)
                    for element in survival:
                        # frequency from logarithm and then /100, amplitude with limiter, phase as it is
                        print((10**element[0])/100, min(element[1], 0.1), element[2])
                    print(time)
                    return
                elif tot_sec_gen > 30:
                    time = 30-(tot_sec_gen-time)
                    survival = pop[int(fitness[distribution.rvs(size=1)][0][0])]
                    we_survived.append(survival)
                    for element in survival:
                        # frequency from logarithm and then /100, amplitude with limiter, phase as it is
                        print((10**element[0])/100, min(element[1], 0.1), element[2])
                    print(time)
                    # actual performance
                    tot_sec_gen = 0
                    return
                else:
                    survival = pop[int(fitness[distribution.rvs(size=1)][0][0])]
                    we_survived.append(survival)
                    # actual performance
                    for element in survival:
                        # frequency from logarithm and then /100, amplitude with limiter, phase as it is
                        print((10**element[0])/100, min(element[1], 0.1), element[2])
                    print(time)
                    we_survived.append(survival)
                    iterate()
            iterate()

            return we_survived

        survival_first = performance(population, first_generation)


        #'''SECOND GENERATION'''

        # 1 % mutation
        mutation_rate = 0.01
        survival_second = []

        def crossover(survivals):
            children = []
            for i in range(len(survivals)*2):
                child = []
                pick1 = random.randrange(len(survivals))
                pick2 = random.randrange(len(survivals))

                # appends the whole vector (f, a, phi)
                child.append(survivals[pick1][random.randrange(3)])
                child.append(survivals[pick2][random.randrange(3)])
                child.append(survivals[pick2][random.randrange(3)])
                children.append(child)
            return children

        def mutation(pop, rate):
            # each element
            for citizen in pop:
                for element in citizen:
                    for index, value in enumerate(element):
                        chance = np.random.uniform(0, 1, 1)
                        if chance <= rate:
                            if index == 0:
                                # frequency
                                element[0] = np.random.uniform(np.log10(20), np.log10(5000), 1)
                            if index == 1:
                                element[1] = np.random.uniform(0, 0.1, 1)
                            if index == 2:
                                element[2] = np.random.uniform(0, 100, 1)
            return pop

        #crossover between elements in the first generation (parents)
        survival_first = crossover(survival_first)
        survival_first = mutation(survival_first, mutation_rate)

        # finds the fitness function for the children
        second_generation, fitness = evaluate_fitness(survival_first)
        # performes based on the distribution
        survival_second = performance(survival_first, second_generation)

        #'''THIRD GENERATION'''

        survival_third = []

        survival_second = crossover(survival_second)
        survival_second = mutation(survival_second, mutation_rate)

        # finds the fitness function for the children
        third_generation, fitness = evaluate_fitness(survival_second)

        survival_third = performance(survival_second, third_generation)

        #'''FOURTH GENERATION'''


        survival_fourth = []

        survival_third = crossover(survival_third)
        survival_second = mutation(survival_third, mutation_rate)
        fourth_generation, fitness = evaluate_fitness(survival_third)

        survival_fourth = performance(survival_third, fourth_generation)


# start process
if __name__ == '__main__':
    main()