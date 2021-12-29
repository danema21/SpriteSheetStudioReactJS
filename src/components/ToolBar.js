import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import './assets/ToolBar.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { ButtonGroup } from 'react-bootstrap';


function ToolBar({setLineColor, setLineWidth}){
    

    return (
        <div className="toolBar fixed-bottom">
            <ButtonGroup id="toolbarBtnGroup">
                <Button variant='secondary'>
                    <Dropdown drop='up' autoClose='outside'>
                        <Dropdown.Toggle variant='secondary'>
                            Tools
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item><button>pencil</button></Dropdown.Item>
                            <Dropdown.Item><button>brush</button></Dropdown.Item>
                            <Dropdown.Item><button>eraser</button></Dropdown.Item>
                            <Dropdown.Item><button>filler</button></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Button>
                <Button variant='secondary'><input type="color" value="#000000"></input></Button>
                <Button variant='secondary'>
                    <Dropdown drop='up' autoClose='outside'>
                        <Dropdown.Toggle variant='secondary'>
                            Tool size
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <input type='range' min='1' max='40' ></input>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Button>
                <Button variant='secondary'>
                    <Dropdown drop='up' autoClose='outside'>
                        <Dropdown.Toggle variant='secondary'>
                            Layout
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <button>gridOn</button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Button>
                <Button variant='secondary'>
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
                </Button>
            </ButtonGroup>
        </div>
    );
}

export default ToolBar;