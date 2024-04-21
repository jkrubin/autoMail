import React, { HTMLAttributes, PropsWithChildren } from "react";
import { Icon, Popup } from "semantic-ui-react";

const Tooltip: React.FC<PropsWithChildren & HTMLAttributes<HTMLDivElement>> = ({children, ...rest}) => {

    return(
        <div {...rest}>
            <Popup trigger={<Icon name="info circle" size="large"/>}>
                <div className="tooltip">
                    {children}
                </div>
            </Popup>
        </div>
    )
}

export default Tooltip