import * as _ from 'lodash'
import { Point, Line } from "../utils/geometry";
import { actionCreator, actionCreatorVoid } from "./helpers";
import { AxonStateType, DendStateType } from '../reducers/network';
import { IState } from '../reducers';

export type MoveNeuronAction = {
    id: string,
    pos: Point
}

export type AddNeuronAction = {
    id: string,
    pos: Point
}

export type SelectNeuronAction = {
    id: string
}

export type AddNewSynapseAction = {
    axon: {
        id: string,
        neuronId: string
    },
    dend: {
        id: string,
        neuronId: string
    }
}

export type AddSynapseAction = {
    id: string,
} & AddNewSynapseAction

export type MakeGhostSynapseAtAxonAction = {
    id: string,
    neuronId: string
}

export type MakeGhostSynapseAtDendAction = {
    id: string,
    neuronId: string
}

export const moveNeuron = actionCreator<MoveNeuronAction>('MOVE_NEURON')
export const addNeuron = actionCreator<AddNeuronAction>('ADD_NEURON')
export const selectNeuron = actionCreator<SelectNeuronAction>('SELECT_NEURON')
export const addSynapse = actionCreator<AddSynapseAction>('ADD_SYNAPSE')
export const makeGhostSynapseAtAxon = actionCreator<MakeGhostSynapseAtAxonAction>('MAKE_GHOST_SYNAPSE_AT_AXON')
export const makeGhostSynapseAtDend = actionCreator<MakeGhostSynapseAtDendAction>('MAKE_GHOST_SYNAPSE_AT_DEND')
export const resetGhostSynapse = actionCreatorVoid('RESET_GHOST_SYNAPSE')

export function addNewNeuron(pos: Point) {
    return (dispatch: Function) => {
        dispatch(addNeuron({id: _.uniqueId('n'), pos: pos}))
    }
}

export function addNewSynapse(payload: AddNewSynapseAction) {
    return (dispatch: Function) => {
        dispatch(addSynapse({id: _.uniqueId('s'), ...payload}))
    }
}

export function tryMakeSynapseAtDend(id: string, neuronId: string) {
    return (dispatch: Function, getState: () => IState) => {
        const ghost = getState().network.ghostSynapse

        if (ghost.axon && !ghost.dend) {
            dispatch(addNewSynapse({
                axon: {id: ghost.axon.id, neuronId: ghost.axon.neuronId},
                dend: {id: id, neuronId: neuronId}
            }))
            dispatch(resetGhostSynapse())
        } else {
            dispatch(makeGhostSynapseAtDend({id: id, neuronId: neuronId}))
        }
    }
}

export function tryMakeSynapseAtAxon(id: string, neuronId: string) {
    return (dispatch: Function, getState: () => IState) => {
        const ghost = getState().network.ghostSynapse

        if (ghost.dend && !ghost.axon) {
            dispatch(addNewSynapse({
                axon: {id: id, neuronId: neuronId},
                dend: {id: ghost.dend.id, neuronId: ghost.dend.neuronId}
            }))
            dispatch(resetGhostSynapse())
        } else {
            dispatch(makeGhostSynapseAtAxon({id: id, neuronId: neuronId}))
        }
    }
}

