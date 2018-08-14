import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Neuron } from './Neuron'
import { Point } from '../utils/geometry';
import { remote } from 'electron';
import { NeuronState, SynapseState } from '../reducers/network';
import { SelectNeuronAction, MoveNeuronAction, selectNeuron, addNeuron, MoveGhostSynapseAction, StartSynapseAction, startSynapse } from '../actions/network';
import { Synapse } from './Synapse';
const { Menu } = remote

export interface IProps extends RouteComponentProps<any> {
    moveGhostSynapse: (payload: MoveGhostSynapseAction) => void,
    startSynapse: (payload: StartSynapseAction) => void,
    selectNeuron: (payload: SelectNeuronAction) => void,
    moveNeuron: (payload: MoveNeuronAction) => void,
    addNewNeuron(pos: Point): void,
    newSynapseGhosting: boolean,
    neurons: Array<NeuronState>
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
            moveGhostSynapse
        } = this.props

        moveGhostSynapse({stop: {x: e.clientX, y: e.clientY}})
    }

    render() {
        const {
            newSynapseGhosting,
            neurons,
            synapses,
            selectNeuron,
            moveNeuron,
        } = this.props

        return (
            <svg
                width="1000"
                height="1000"
                onContextMenu={this.onContextMenu.bind(this)}
                onMouseMove={newSynapseGhosting ? this.handleMouseMove : undefined}
            >
                {neurons.map((neuron: any) => 
                    <Neuron className="neuron"
                        selectNeuron={selectNeuron}
                        startSynapse={startSynapse}
                        moveNeuron={moveNeuron}
                        key={neuron.id}
                        {...neuron}
                    />
                )}
                {synapses.map((synapse: SynapseState) => 
                    <Synapse className="synapse"
                        {...synapse}
                    />
                )}
            </svg>
        )
    }
}