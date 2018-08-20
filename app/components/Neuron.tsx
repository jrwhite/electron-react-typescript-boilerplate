import * as React from 'react'
import { RouteComponentProps, StaticRouter } from 'react-router';
import { Ellipse } from './Ellipse';
import { Point } from '../utils/geometry';
import { SelectNeuronAction, MoveNeuronAction, makeGhostSynapseAtAxon, MakeGhostSynapseAtAxonAction, makeGhostSynapseAtDend, MakeGhostSynapseAtDendAction, tryMakeSynapseAtAxon, tryMakeSynapseAtDend, tryMakeSynapseAtNewDend, } from '../actions/network';
import Draggable from 'react-draggable'
import { DendStateType } from '../reducers/network';
import { NeuronBody } from './NeuronBody'
import { Dendrite } from './Dendrite'

export interface IProps extends RouteComponentProps<any> {
    selectNeuron: (payload: SelectNeuronAction) => void,
    moveNeuron: (payload: MoveNeuronAction) => void,
    tryMakeSynapseAtAxon: (id: string, neuronId: string) => void,
    tryMakeSynapseAtNewDend: (neuronId: string, neuronPos: Point) => void
    id: string,
    pos: Point,
    dends: Array<DendStateType>
}

export class Neuron extends React.Component<IProps> {
    props: IProps

    handleNeuronClick (e: React.MouseEvent<SVGGElement>) {
        e.preventDefault()
        const { tryMakeSynapseAtNewDend, id, pos } = this.props

        tryMakeSynapseAtNewDend(id, pos)
    }

    handleAxonClick (e: React.MouseEvent<SVGCircleElement>) {
        e.preventDefault()
        const { tryMakeSynapseAtAxon, id, pos } = this.props

        tryMakeSynapseAtAxon('a', id)
    }
    
    render() {
        const {
            selectNeuron,
            moveNeuron,
            pos,
            id,
            dends
        } = this.props

        return (
            <g
                transform={"translate(" + pos.x + " " + pos.y + ")"}
            >
                <g
                        onClick = {this.handleNeuronClick.bind(this)}
                >
                    <NeuronBody dends={dends} />
                    // TODO: Add Soma
                    {dends.map(d => <Dendrite key={d.id} dend={d} />)}
                </g>
                <circle cx={50} cy={0} r={5}
                    onClick = {this.handleAxonClick.bind(this)}
                />
            </g>
        )
    }
}