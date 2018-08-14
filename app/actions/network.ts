import * as _ from 'lodash'
import { Point, Line } from "../utils/geometry";
import { actionCreator } from "./helpers";

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

export type StartSynapseAction = {
    neuronId: string,
    pos: Point,
}

export type MoveGhostSynapseAction = {
    stop: Point
}

export const moveNeuron = actionCreator<MoveNeuronAction>('MOVE_NEURON')
export const addNeuron = actionCreator<AddNeuronAction>('ADD_NEURON')
export const selectNeuron = actionCreator<SelectNeuronAction>('SELECT_NEURON')
export const startSynapse = actionCreator<StartSynapseAction>('START_SYNAPSE')
export const moveGhostSynapse = actionCreator<MoveGhostSynapseAction>('MOVE_SYNAPSE')

export function addNewNeuron(pos: Point) {
    return (dispatch: Function) => {
        dispatch(addNeuron({id: _.uniqueId('n'), pos: pos}))
    }
}
