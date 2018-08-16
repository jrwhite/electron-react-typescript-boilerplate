import { Line, Point } from "../utils/geometry";
import { IAction, IActionWithPayload } from "../actions/helpers";
import { moveNeuron, addNeuron, AddNeuronAction, startSynapse } from "../actions/network";

export type AxonStateType = {
    id: string,
    cpos: Point,
    synapses: Array<string>
}

export type DendStateType = {
    id: string,
    weighting: number,
    cpos: Point,
    theta: number,
    synapseId: string,
    incomingAngle: number
}

export type NeuronState = {
    id: string,
    pos: Point,
    potential: number,
    axon: AxonStateType,
    dends: Array<DendStateType>
}

export type SynapseState = {
    id: string,
    axon: {
        id: string,
        neuronId: string,
    },
    dend: {
        id: string,
        neuronId: string,
    },
    length: number,
    width: number,
    speed: number
}

export type GhostSynapseState = {
    axon?: {
        id: string,
        neuronId: string
    },
    dend?: {
        id: string,
        neuronId: string
    }
}

export type NetworkState = {
    ghostSynapse: GhostSynapseState,
    neurons: Array<NeuronState>,
    synapses: Array<SynapseState>,
}

const initialNeuronState: NeuronState = {
    id: 'n',
    pos: {x: 0, y: 0},
    potential: 0,
    axon: {id: 'a', cpos: {x: 25, y: 0}, synapses: []},
    dends: []
}

const initialSynapseState: SynapseState = {
    id: 's',
    axon: {id: 'a', neuronId: 'n'},
    dend: {id: 'd', neuronId: 'n'},
    length: 0,
    width: 2,
    speed: 1
}

const initialNetworkState: NetworkState = {
    ghostSynapse: {},
    neurons: [],
    synapses: [],
}

export default function network(
    state: NetworkState = initialNetworkState,
    action: IAction
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
                    id: action.payload.id,

                }
            ]
        }
    }
        else {
        return state
    }
}