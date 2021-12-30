import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/ToolBar.css';
import Dropdown from 'react-bootstrap/Dropdown';


function ToolBar({setLineColor, setLineWidth}){
    

    return (
        <div className="toolBar fixed-bottom bg-secondary">
            <Dropdown drop='up' autoClose='outside'>
                <Dropdown.Toggle variant='secondary'>
                    Tools
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>pencil</Dropdown.Item>
                    <Dropdown.Item>brush</Dropdown.Item>
                    <Dropdown.Item>eraser</Dropdown.Item>
                    <Dropdown.Item>filler</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <input type="color" 
            value="#000000"
            onChange={(e) => {
                setLineColor(e.target.value);
            }}
            ></input>
            <Dropdown drop='up' autoClose='outside'>
                <Dropdown.Toggle variant='secondary'>
                    Tool size
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>
                        <input type='range'
                            min='1'
                            max='40' 
                            defaultValue='5'
                            onChange={(e) => {
                                setLineWidth(e.target.value);
                            }}
                            ></input>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown drop='up' autoClose='outside'>
                <Dropdown.Toggle variant='secondary'>
                    Layout
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>
                        Grid On
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown drop='up'>
                <Dropdown.Toggle variant='secondary'>
                    Menu
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>New...</Dropdown.Item>
                    <Dropdown.Item>Open...</Dropdown.Item>
                    <Dropdown.Item>Animation preview</Dropdown.Item>
                    <Dropdown.Item>Help</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default ToolBar;