import sys, json, numpy as np

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()

    #create a numpy array
    np_lines = np.array(lines)
    '''for element in np_lines:
        print(element, int(np.random.uniform(1,10,1)))'''
    print([[[[ 1.72141429,  0.76865329, 74.09904277],
            [ 2.35237334,  0.94090584, 74.25664621],
            [ 3.84675196, 0.46457483, 89.09691922]], 1], 
            [[[ 1.72141429,  0.76865329, 74.09904277],
            [ 2.35237334,  0.94090584, 74.25664621],
            [ 3.84675196, 0.46457483, 89.09691922]], 9]
            ])

#start process
if __name__ == '__main__':
    main()