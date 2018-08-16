import { IState } from "../reducers";
import { IProps } from "../components/Synapse";
import { createSelector } from "reselect";
import { addPoints } from "../utils/geometry";
import { SynapseState } from "../reducers/network";

const getSynapse = (state: IState, props: IProps) =>
    state.network.synapses.find(s => s.id === props.id)

const getAxonNeuronPos = (state: IState, props: IProps) =>
    state.network.neurons.find(n => n.id === props.axon.neuronId)!!
        .pos
    
const getDendNeuronPos = (state: IState, props: IProps) =>
    state.network.neurons.find(n => n.id === props.dend.neuronId)!!
        .pos

const getAxonPos = (state: IState, props: IProps) =>
    state.network.neurons.find(n => n.id === props.axon.neuronId)!!
        .axon!!
        .cpos

const getDendPos = (state: IState, props: IProps) => 
    state.network.neurons.find(n => n.id === props.dend.neuronId)!!
        .dends.find(d => d.id === props.dend.id)!!
        .cpos

export const makeGetSynapseState = () => createSelector(
    getSynapse,
    getAxonNeuronPos,
    getDendNeuronPos,
    getAxonPos,
    getDendPos,
    (synapse, axonNeuronPos, dendNeuronPos, axonPos, dendPos) => ({
        ...synapse,
        // id: synapse!!.id,
        // axon: synapse!!.axon,
        // dend: synapse!!.dend,
        // length: synapse!!.length,
        // width: synapse!!.width,
        // speed: synapse!!.speed,
        axonPos: addPoints(axonNeuronPos, axonPos),
        dendPos: addPoints(dendNeuronPos, dendPos),
    })
)

// export const makeGetSynapseState = () => createSelector(
//     getSynapse,
//     synapse => (
//         {...synapse}
//     )
// )