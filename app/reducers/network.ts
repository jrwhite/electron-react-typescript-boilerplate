import { Line, Point } from "../utils/geometry";
import { IAction, IActionWithPayload } from "../actions/helpers";
import { moveNeuron, addNeuron, AddNeuronAction, startSynapse } from "../actions/network";

export type NeuronState = {
    id: string,
    pos: Point,
    selected: boolean,
    potential: number,
}

export type SynapseState = {
    id: string,
    isGhost: boolean,
    line: Line,
    axon: {
        neuronId: string,
    },
    dendrite: {
        neuronId: string,
        dendriteId: string,
    }
}

export type NetworkState = {
    newSynapseGhosting: boolean,
    neurons: Array<NeuronState>,
    synapses: Array<SynapseState>,
}

const initialNeuronState: NeuronState = {
    id: 'n',
    pos: {x: 0, y: 0},
    selected: false,
    potential: 0,
}

const initialSynapseState: SynapseState = {
    id: 's',
    isGhost: false,
    line: {start: {x: 0, y: 0}, stop: {x: 0, y: 0}},
    axon: {neuronId: 'n'},
    dendrite: {neuronId: 'n', dendriteId: 'd'},
}

const initialNetworkState: NetworkState = {
    newSynapseGhosting: false,
    neurons: [],
    synapses: [],
}

export default function network(
    state: NetworkState = initialNetworkState,
    action: IAction | IActionWithPayload<AddNeuronAction>
 ) : NetworkState {
     console.log(action)
    if (moveNeuron.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(
                (n: NeuronState) => {
                    if (n.id === action.payload.id) {
                        n.pos = action.payload.pos
                    }
                    return n
                }
            )
        }
    } else if (addNeuron.test(action)) {
        return {
            ...state,
            neurons: [
                ...state.neurons,
                {
                    ...initialNeuronState,
                    id: action.payload.id,
                    pos: action.payload.pos
                }
            ]
        }
    } else if (startSynapse.test(action)) {
        return {
            ...state,
            synapses: [
                ...state.synapses,
                {
                    ...initialSynapseState,
                    id: action.payload.neuronId,

                }
            ]
        }
    }
        else {
        return state
    }
}