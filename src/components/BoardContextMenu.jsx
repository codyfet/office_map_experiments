import * as React from 'react';
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';


const onClick = ({ event, props }) => console.log(event,props);

export default class BoardContextMenu {
    

    render() {
        return (
            <Menu id='menu_id'>
                <Item onClick={onClick}>Rotate</Item>
                <Item onClick={onClick}>Move</Item>
                <Separator />
                <Item disabled>Remove</Item>
                <Separator />
                <Submenu label="Workers">
                <Item onClick={onClick}>John</Item>
                <Item onClick={onClick}>Julia</Item>
                </Submenu>
            </Menu>
        );
    }
};
  