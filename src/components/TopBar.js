import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './assets/TopBar.css';

function TopBar() {

    return (
        <div className="topBar">
            <ButtonGroup id="topBarButtonGroup" vertical>
                <ButtonGroup size="lg">
                <Button variant="secondary">Remove Frame</Button>
                <Button variant="secondary">Add Frame</Button>

                <ButtonGroup vertical>
                    <Button variant="secondary">Remove Row</Button>
                    <Button variant="secondary">Add Row</Button>
                </ButtonGroup>
                </ButtonGroup>
            </ButtonGroup>

            <div id="framesBar">
                <ButtonGroup size="sm">
                <Button variant='dark'>1</Button>
                </ButtonGroup>
            </div>

            <div id="undoRedo">
                <ButtonGroup>
                <Button variant='secondary'>undo</Button>
                <Button variant='secondary'>redo</Button>
                </ButtonGroup>
            </div>
        </div>
    );  
}

export default TopBar;