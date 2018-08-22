import { Line, Point } from "../utils/geometry";
import { IAction, IActionWithPayload } from "../actions/helpers";
import { moveNeuron, addNeuron, addSynapse, makeGhostSynapseAtDend, makeGhostSynapseAtAxon, addDend, resetGhostSynapse, removeNeuron, fireNeuron, fireSynapse, exciteNeuron, finishFiringSynapse, resetSynapse, decayNetwork,  } from "../actions/network";
import { Arc } from '../utils/geometry'
import * as _ from 'lodash'
import { Neuron } from "../components/Neuron";

export type AxonStateType = {
    id: string,
    cpos: Point,
    synapses: Array<{synapseId: string}>
}

export type DendStateType = {
    id: string,
    weighting: number,
    cpos: Point,
    nu: number,
    arc: Arc,
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
    speed: number,
    isFiring: boolean,
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
    axon: {id: 'a', cpos: {x: 50, y: 0}, synapses: []},
    dends: []
}

const initialSynapseState: SynapseState = {
    id: 's',
    axon: {id: 'a', neuronId: 'n'},
    dend: {id: 'd', neuronId: 'n'},
    length: 0,
    width: 2,
    speed: 1,
    isFiring: true
}

const initialNetworkState: NetworkState = {
    ghostSynapse: {axon: undefined, dend: undefined},
    neurons: [],
    synapses: [],
}

export default function network(
    state: NetworkState = initialNetworkState,
    action: IAction
 ) : NetworkState {
    if (moveNeuron.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(
                (n: NeuronState) => {
                    if (n.id === action.payload.id) {
                        return {
                            ...n,
                            ...action.payload
                        }
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
                    ...action.payload
                }
            ]
        }
    } else if (removeNeuron.test(action)) {
        const neuronToRemove: NeuronState = state.neurons.find(n => n.id == action.payload.id)!!
        const synapsesToRemove: Array<{synapseId: string}> = _.concat(
            neuronToRemove.axon.synapses,
            neuronToRemove.dends.map(d => ({synapseId: d.synapseId}))
        )
        return {
            ...state,
            neurons: _.chain(state.neurons)
                .filter(n => n.id !== action.payload.id)
                .map(n => ({
                    ...n,
                    axon: {
                        ...n.axon,
                        synapses: _.differenceBy(n.axon.synapses, synapsesToRemove, 'synapseId')
                    },
                    dends: _.differenceBy(n.dends, synapsesToRemove, 'synapseId')
                }))
                .value(),
            synapses: _.differenceWith(state.synapses, synapsesToRemove, (a,b) => a.id == b.synapseId)
        }
    }
    else if (exciteNeuron.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(n => {
                if (n.id == action.payload.id) {
                    return {
                        ...n,
                        potential: n.potential + n.dends.find(d => d.id == action.payload.dendId)!!.weighting
                    }
                }
                return n
            })
        }
    }
    else if (fireSynapse.test(action)) {
        return {
            ...state,
            synapses: state.synapses.map(s => {
                if (s.id == action.payload.id) {
                    return {
                        ...s,
                        isFiring: true
                    }
                }
                return s
            })
        }
    }
    else if (resetSynapse.test(action)) {
        return {
            ...state,
            synapses: state.synapses.map(s => {
                if (s.id == action.payload.id) {
                    return {
                        ...s,
                        isFiring: false
                    }
                }
                return s
            })
        }
    }
     else if (fireNeuron.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(n => {
                if (n.id == action.payload.id) {
                    return {
                        ...n,
                        potential: -100
                    }
                }
                return n
            })
        }
    }
    else if (addSynapse.test(action)) {
        return {
            ...state,
            // split into two reducers (synapse,neuron) with this logic in action
            neurons: state.neurons.map(n => {
                if (n.id == action.payload.axon.neuronId) {
                    return {
                        ...n,
                        axon: {
                            ...n.axon,
                            synapses: _.concat(n.axon.synapses, {synapseId: action.payload.id})
                        }
                    }
                } else if (n.id == action.payload.dend.neuronId) {
                    return {
                        ...n,
                        dends: n.dends.map(d => {
                            if (d.id == action.payload.dend.id) {
                                return {
                                    ...d,
                                    synapseId: action.payload.id
                                }
                            }
                            return d
                        })
                    }
                }
                return n
            }),
            synapses: [
                ...state.synapses,
                {
                    ...initialSynapseState,
                    ...action.payload
                }
            ]
        }
    } else if (makeGhostSynapseAtAxon.test(action)) {
        return {
            ...state,
            ghostSynapse: {
                axon: {
                    ...action.payload
                }
            }
        }
    } else if (makeGhostSynapseAtDend.test(action)) {
        return {
            ...state,
            ghostSynapse: {
                dend: {
                    ...action.payload
                }
            }
        }
    } else if (addDend.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(
                (n: NeuronState) => {
                    if (n.id == action.payload.neuronId) {
                        return {
                            ...n,
                            dends: [
                                ...n.dends,
                                {
                                    ...action.payload,
                                    arc: { start: action.payload.nu - 1 / 16, stop: action.payload.nu + 1 / 16 },
                                    weighting: 30,
                                    synapseId: 's'
                                }
                            ]
                        }
                    }
                    return n
                }
            )
        }
    } else if (resetGhostSynapse.test(action)) {
        return {
            ...state,
            ghostSynapse: {
                axon: undefined,
                dend: undefined
            }
        }
    }    else if (decayNetwork.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(n => ({
                ...n,
                potential: n.potential * 63 /64
            }))
        }
    }
    else {
        return state
    }
}