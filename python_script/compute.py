import sys, json
import numpy as np
import scipy as sp
from scipy import stats
import math

lo_freq = 10
hi_freq = 10000
offset = 100
max_sec = 30
# population size
pop_size = 10

tot_sec_gen = 0

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
            element[0] = math.log10(element[0] * 1000)

        likeX = np_lines

        population = []

        # population
        for i in range(pop_size):
            # samples drawn from uniform distribution
            population.append(np.random.uniform(0, 1, (3, 3)))
        
        for citizen in population:
            for dna in citizen:
                # rescaling the frequency range of the population -- it's the logarithm already! 10^1 < f < 10^4
                dna[0] = np.random.uniform(1, 4, 1)
                # amplitude range stays the same
                # phase/offset range
                dna[2] = dna[2] * 100

        # COMPUTING THE UNIQUE LIKES and assigning the count
        population = np.array(population)
        
        s, _, _ = np.shape(population)
        population = population.reshape((s, 3, 3))
        

        # check for the same likes
        uniqueLikes, count = np.unique(likeX, axis=0, return_counts=True)
        # print(" unique : ", uniqueLikes, sep='\n')
        # print(" counts : ", count)
        # FITNESS
        fitness = []

        for l_index, like in enumerate(uniqueLikes):
            for c_index, citizen in enumerate(population):
                #citizen = np.reshape(citizen, (9,))
                sq_diff = like - citizen
                sq_diff = sq_diff ** 2
                if count[l_index] > 1:
                    sq_diff = sq_diff / count[l_index]
                # sums of the squared errors
                summy = np.sum(sq_diff)
                # fitness : citizen index, like index, squared sum
                fitness.append(np.array((c_index, l_index, summy)))

        # fitness array dimensions is: (population x unique likes) x 3
        fitness = np.reshape(fitness, (len(population) * len(uniqueLikes), 3))

        _, _, total_s = np.sum(fitness, axis=0)

        # creates index axis for prob distribution
        fit_index = np.arange(len(fitness))
        # prob axis
        fit_prob = []
        for index, elem in enumerate(fitness):
            # normalising
            elem[2] = elem[2] / total_s
            # reversing : smaller squared difference is higher fitness
            elem[2] = 1 - elem[2]

        _, _, new_total_s = np.sum(fitness, axis=0)

        for elem in fitness:
            # normalising again
            elem[2] = elem[2] / new_total_s
            fit_prob.append(elem[2])

        # creates the probability density function
        first_gen = sp.stats.rv_discrete(name='first_gen', values=(fit_index, fit_prob))

        # sets the population back to frequencies/1000
        for element in population[0]:
            element[0] = (10**element[0])/1000

        # prints the first generation

        def performance():
            global tot_sec_gen
            # from 1 to 7 seconds
            time = int(np.random.uniform(1, 7, 1))
            tot_sec_gen += time

            if tot_sec_gen == 30:
                tot_sec_gen = 0
                return
            elif tot_sec_gen > 30:
                time = 30 - (tot_sec_gen - time)
                print(population[int(fitness[first_gen.rvs(size=1)][0][0])], time)
                tot_sec_gen = 0
                return
            else:
                print(population[int(fitness[first_gen.rvs(size=1)][0][0])], time)
                performance()
        performance()


# start process
if __name__ == '__main__':
    main()