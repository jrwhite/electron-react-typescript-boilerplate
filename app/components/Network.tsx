import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import Neuron from '../containers/Neuron'
import { Point, addPoints } from '../utils/geometry';
import { remote } from 'electron';
import { NeuronState, SynapseState, GhostSynapseState } from '../reducers/network';
import Synapse from '../containers/Synapse'
import { GhostSynapse } from './GhostSynapse';
const { Menu } = remote

export interface IProps extends RouteComponentProps<any> {
    addNewNeuron(pos: Point): void,
    ghostSynapse: GhostSynapseState,
    neurons: Array<NeuronState>,
    synapses: Array<SynapseState>
}

export interface IState {
    mouse: {
        pos: Point
    }
}

const initialState: IState = {
    mouse : {
        pos : {x: 0, y: 0}
    }
}

export class Network extends React.Component<IProps,IState> {
    props: IProps
    state: IState = initialState

    onContextMenu(e: any) {
        e.preventDefault()
        const { addNewNeuron } = this.props
        const pos: Point = {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }

        Menu.buildFromTemplate([
            {
                label: 'Add neuron',
                // click: () => addNeuron({key: _.uniqueId('n'), pos: poijknt})
                click: () => addNewNeuron(pos)
            } 
        ]).popup(remote.getCurrentWindow())
    }

    handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
        e.preventDefault()
        const {
            mouse
        } = this.state

        const newPos = {x: e.clientX, y: e.clientY}
        this.setState({mouse: {pos: newPos}})
    }

    render() {
        const {
            ghostSynapse,
            neurons,
            synapses,
        } = this.props

        // TODO: refactor ghostSynapse into separate component
        const axonNeuron = ghostSynapse.axon ? neurons.find(n => n.id === ghostSynapse.axon!!.neuronId) : undefined
        const dendNeuron = ghostSynapse.dend ? neurons.find(n => n.id === ghostSynapse.dend!!.neuronId) : undefined

        return (
            <svg
                width="1000"
                height="1000"
                onContextMenu={this.onContextMenu.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
            >
                {ghostSynapse && this.state.mouse ? <GhostSynapse 
                    axon={axonNeuron ? {
                        pos: addPoints(axonNeuron.pos, axonNeuron.axon.cpos)
                    } : undefined}
                    dend={dendNeuron ? {
                        pos: addPoints(dendNeuron.pos, dendNeuron.dends.find(
                            d => d.id === ghostSynapse.dend!!.id
                        )!!.cpos)
                    } : undefined}
                    mouse={this.state.mouse}
                /> : undefined}
                {neurons.map((neuron: NeuronState) => 
                    <Neuron 
                        key={neuron.id} 
                        {...neuron} 
                    />
                )}
                {synapses.map((synapse: SynapseState) => 
                    <Synapse 
                        key={synapse.id}
                        {...synapse}
                    />
                )}
            </svg>
        )
    }
}