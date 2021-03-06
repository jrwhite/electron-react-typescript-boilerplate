import * as React from 'react'
import { Ellipse, ellipseBoundarySetter } from '../utils/geometry'

let styles = require('./Soma.scss')

export interface IProps {
    id: string,
    potential: number // percentage
}

export const Soma: React.SFC<IProps> = (props) => {
    const {
        id,
        potential
    } = props

    const geo: Ellipse = {
        major: 40,
        minor: 24,
        ecc: 3/5,
        theta: 0
    }

    const potPx = (80 * (potential / 100)) - 80

    return (
        <g
            className={potential >= 0 ? styles.excited : styles.depressed}
            data-tid={potential >= 0 ? 'excited' : 'depressed'}
            data-tclass={potential >= 0 ? 'excited' : 'depressed'}
        >
            <defs>
                <clipPath id={"clip-ellipse-" + id}>
                    <rect
                        x={potPx >= 0 ? potPx : (80 + potPx) -40}
                        y={-24}
                        width={80}
                        height={48}
                    />
                </clipPath>
            </defs>
            <path
                d={ellipseBoundarySetter(geo.major, geo.minor, geo.theta)}
                clipPath={"url(#clip-ellipse-" + id + ")"}
            />
        </g>
    )
}