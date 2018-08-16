import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import Neuron from '../containers/Neuron'
import { Point } from '../utils/geometry';
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

export class Network extends React.Component<IProps> {
    props: IProps

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
        const {
        } = this.props

    }

    render() {
        const {
            ghostSynapse,
            neurons,
            synapses,
        } = this.props

        return (
            <svg
                width="1000"
                height="1000"
                onContextMenu={this.onContextMenu.bind(this)}
            >
                {ghostSynapse ? <GhostSynapse/> : undefined}
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