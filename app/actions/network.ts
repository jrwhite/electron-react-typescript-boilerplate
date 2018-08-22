import * as _ from 'lodash'
import { Point, Line, Ellipse, DendGeo, calcClosestDend } from "../utils/geometry";
import { actionCreator, actionCreatorVoid } from "./helpers";
import { AxonStateType, DendStateType } from '../reducers/network';
import { IState } from '../reducers';
import { getAxonAbsPos } from '../selectors/synapse';

export type MoveNeuronAction = {
    id: string,
    pos: Point
}

export type RemoveNeuronAction = {
    id: string
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

export type AddDendAction = {
    id: string,
    neuronId: string,
    cpos: Point,
    nu: number,
    incomingAngle: number
}

export type ExciteNeuron = {
    id: string,
    dendId: string
}

export type HyperpolarizeNeuron = {
    id: string
}

export type FireSynapse = {
    id: string
}

export type ResetSynapse = {
    id: string
}

export const removeNeuron = actionCreator<RemoveNeuronAction>('REMOVE_NEURON')
export const moveNeuron = actionCreator<MoveNeuronAction>('MOVE_NEURON')
export const addNeuron = actionCreator<AddNeuronAction>('ADD_NEURON')
export const selectNeuron = actionCreator<SelectNeuronAction>('SELECT_NEURON')
export const addSynapse = actionCreator<AddSynapseAction>('ADD_SYNAPSE')
export const makeGhostSynapseAtAxon = actionCreator<MakeGhostSynapseAtAxonAction>('MAKE_GHOST_SYNAPSE_AT_AXON')
export const makeGhostSynapseAtDend = actionCreator<MakeGhostSynapseAtDendAction>('MAKE_GHOST_SYNAPSE_AT_DEND')
export const resetGhostSynapse = actionCreatorVoid('RESET_GHOST_SYNAPSE')
export const addDend = actionCreator<AddDendAction>('ADD_DEND')
export const decayNetwork = actionCreatorVoid('DECAY_NETWORK')
export const hyperpolarizeNeuron = actionCreator<HyperpolarizeNeuron>('HYPERPOLARIZE_NEURON')
export const exciteNeuron = actionCreator<ExciteNeuron>('EXCITE_NEURON')
export const fireSynapse = actionCreator<FireSynapse>('FIRE_SYNAPSE')
export const resetSynapse = actionCreator<ResetSynapse>('FINISH_FIRING_SYNAPSE')

export function fireNeuron(id: string) {
    return (dispatch: Function, getState: () => IState) => {
        dispatch(hyperpolarizeNeuron({id: id}))
    }
}

export function finishFiringSynapse(id: string) {
    return (dispatch: Function, getState: () => IState) => {
        dispatch(resetSynapse({id: id}))
        const dend: {id: string, neuronId: string} = getState().network.synapses.find(s => s.id == id)!!.dend
        dispatch(exciteNeuron({id: dend.neuronId, dendId: dend.id}))
    }
}

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

export function addNewDend(newDendId: string, neuronId: string, neuronPos: Point, axonPos: Point, bodyEllipse: Ellipse) {
    return (dispatch: Function) => {
        const newDendGeo: DendGeo = calcClosestDend(neuronPos, axonPos, bodyEllipse)

        dispatch(addDend(
            {
                id: newDendId,
                neuronId: neuronId,
                cpos: newDendGeo.point,
                nu: newDendGeo.nu,
                incomingAngle: newDendGeo.inTheta
            }
        ))
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

export function tryMakeSynapseAtNewDend(neuronId: string, neuronPos: Point) {
    // using ghost synapse axon
    // this likely replaces tryMakeSynapseAtDend
    return (dispatch: Function, getState: () => IState) => {
        const ghost = getState().network.ghostSynapse

        if (ghost.axon && !ghost.dend) {

            const newId = _.uniqueId('d')
            dispatch(
                addNewDend(
                    newId,
                    neuronId,
                    neuronPos,
                    getAxonAbsPos(getState(), ghost),
                    { major: 50, minor: 30, theta: 0, ecc: 50 / 20 }
                )
            )
            dispatch(tryMakeSynapseAtDend(newId, neuronId))
        }
    }
}

export function tryMakeSynapseAtAxon(id: string, neuronId: string) {
    return (dispatch: Function, getState: () => IState) => {
        const ghost = getState().network.ghostSynapse

        if (ghost.dend && !ghost.axon) {
            dispatch(addNewSynapse({
                axon: { id: id, neuronId: neuronId },
                dend: { id: ghost.dend.id, neuronId: ghost.dend.neuronId }
            }))
            dispatch(resetGhostSynapse())
        } else {
            dispatch(makeGhostSynapseAtAxon({id: id, neuronId: neuronId}))
        }
    }
}

