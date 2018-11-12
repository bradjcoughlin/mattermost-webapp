// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

export default class InteractiveDialog extends React.Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        callbackId: PropTypes.string,
        elements: PropTypes.arrayOf(PropTypes.object).isRequired,
        title: PropTypes.string.isRequired,
        iconUrl: PropTypes.string,
        submitLabel: PropTypes.string,
        notifyOnCancel: PropTypes.bool,
        state: PropTypes.string,
        onHide: PropTypes.func,
        actions: PropTypes.shape({
            submitInteractiveDialog: PropTypes.func.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            show: true,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    handleHide = () => {
        this.setState({show: false});
    }

    render() {
        const {title, iconUrl, submitLabel} = this.props;

        let submitText = (
            <FormattedMessage
                id='interactive_dialog.submit'
                defaultMessage='Submit'
            />
        );
        if (submitLabel) {
            submitText = submitLabel;
        }

        let icon;
        if (iconUrl) {
            icon = (
                <img
                    className='more-modal__image'
                    width='24'
                    height='24'
                    src={iconUrl}
                />
            );
        }

        return (
            <Modal
                dialogClassName='about-modal'
                show={this.state.show}
                onHide={this.handleHide}
                onExited={this.props.onHide}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        {icon}{title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type='button'
                        className='btn btn-default cancel-button'
                        onClick={this.handleHide}
                    >
                        <FormattedMessage
                            id='interactive_dialog.cancel'
                            defaultMessage='Cancel'
                        />
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary save-button'
                        onClick={this.handleSubmit}
                    >
                        {submitText}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
