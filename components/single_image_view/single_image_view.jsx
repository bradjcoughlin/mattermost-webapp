// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {Tooltip} from 'react-bootstrap';

import {getFilePreviewUrl, getFileUrl, getFileDownloadUrl} from 'mattermost-redux/utils/file_utils';

import * as GlobalActions from 'actions/global_actions';
import OverlayTrigger from 'components/overlay_trigger';
import SizeAwareImage from 'components/size_aware_image';
import {FileTypes} from 'utils/constants';
import {
    getFileType,
} from 'utils/utils';
import {localizeMessage} from 'utils/utils.jsx';

import ViewImageModal from 'components/view_image_modal';

const PREVIEW_IMAGE_MIN_DIMENSION = 50;

export default class SingleImageView extends React.PureComponent {
    static propTypes = {
        postId: PropTypes.string.isRequired,
        fileInfo: PropTypes.object.isRequired,
        enablePublicLink: PropTypes.bool.isRequired,
        compactDisplay: PropTypes.bool,
        isEmbedVisible: PropTypes.bool,
        actions: PropTypes.shape({
            toggleEmbedVisibility: PropTypes.func.isRequired,
        }).isRequired,
    };

    static defaultProps = {
        fileInfo: {},
        compactDisplay: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            showPreviewModal: false,
            dimensions: {
                width: props.fileInfo.width,
                height: props.fileInfo.height,
            },
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    static getDerivedStateFromProps(props, state) {
        if ((props.fileInfo.width !== state.dimensions.width) || props.fileInfo.height !== state.dimensions.height) {
            return {
                dimensions: {
                    width: props.fileInfo.width,
                    height: props.fileInfo.height,
                },
            };
        }
        return null;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    imageLoaded = () => {
        if (this.mounted) {
            this.setState({loaded: true});
        }
    }

    handleImageClick = () => {
        this.setState({showPreviewModal: true});
    }

    hidePreviewModal = () => {
        this.setState({showPreviewModal: false});
    }

    toggleEmbedVisibility = () => {
        this.props.actions.toggleEmbedVisibility(this.props.postId);
    }

    handleGetPublicLink = () => {
        GlobalActions.showGetPublicLinkModal(this.props.fileInfo.id);
    }

    render() {
        const {fileInfo, compactDisplay} = this.props;
        const {
            loaded,
        } = this.state;

        const {has_preview_image: hasPreviewImage, id} = fileInfo;
        const fileURL = getFileUrl(id);
        const previewURL = hasPreviewImage ? getFilePreviewUrl(id) : fileURL;

        const previewHeight = fileInfo.height;
        const previewWidth = fileInfo.width;
        const fileName = fileInfo.name;

        let minPreviewClass = '';
        if (
            previewWidth < PREVIEW_IMAGE_MIN_DIMENSION ||
            previewHeight < PREVIEW_IMAGE_MIN_DIMENSION
        ) {
            minPreviewClass = 'min-preview ';

            if (previewHeight > previewWidth) {
                minPreviewClass += 'min-preview--portrait ';
            }
        }

        // Add compact display class to image class if in compact mode
        if (compactDisplay) {
            minPreviewClass += ' compact-display';
        }

        const toggle = (
            <button
                key='toggle'
                className='style--none post__embed-visibility'
                data-expanded={this.props.isEmbedVisible}
                aria-label='Toggle Embed Visibility'
                onClick={this.toggleEmbedVisibility}
            />
        );

        let imageNameClass = 'image-name';
        if (compactDisplay) {
            imageNameClass += ' compact-display';
        }

        const fileHeader = (
            <div
                data-testid='image-name'
                className={imageNameClass}
            >
                <div
                    onClick={this.handleImageClick}
                >
                    {fileInfo.name}
                </div>
                {toggle}
            </div>
        );

        let viewImageModal;
        let fadeInClass = '';

        const fileType = getFileType(fileInfo.extension);
        let styleIfSvgWithDimensions = {};
        let imageContainerStyle = {};
        let svgClass = '';
        if (fileType === FileTypes.SVG) {
            svgClass = 'svg';
            if (this.state.dimensions.height) {
                styleIfSvgWithDimensions = {
                    width: '100%',
                };
            } else {
                imageContainerStyle = {
                    height: 350,
                    maxWidth: '100%',
                };
            }
        }

        if (loaded) {
            viewImageModal = (
                <ViewImageModal
                    show={this.state.showPreviewModal}
                    onModalDismissed={this.hidePreviewModal}
                    fileInfos={[fileInfo]}
                    postId={this.props.postId}
                />
            );

            fadeInClass = 'image-fade-in';
        }

        return (
            <div
                className={`${'file-view--single'}`}
            >
                <div
                    className='file__image'
                >
                    {fileHeader}
                    {this.props.isEmbedVisible &&
                    <div
                        className='image-container'
                        style={imageContainerStyle}
                    >
                        <div
                            className={`image-loaded ${fadeInClass} ${svgClass}`}
                            style={{...styleIfSvgWithDimensions, position: 'relative'}}
                        >
                            <div className={'single-image__button--download'}>
                                <OverlayTrigger
                                    delayShow={400}
                                    placement='top'
                                    overlay={
                                        <Tooltip id='file-name__tooltip'>
                                            {localizeMessage('view_image_popover.download', 'Download')}
                                        </Tooltip>
                                    }
                                >
                                    <a
                                        href={getFileDownloadUrl(fileInfo.id)}
                                        aria-label={localizeMessage('view_image_popover.download', 'Download').toLowerCase()}
                                        download={fileName}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <i className='icon icon-download-outline'/>
                                    </a>
                                </OverlayTrigger>
                            </div>
                            <div className={'single-image__button--permalink'}>
                                <OverlayTrigger
                                    delayShow={400}
                                    placement='top'
                                    overlay={
                                        <Tooltip id='file-name__tooltip'>
                                            {'Copy public link'}
                                        </Tooltip>
                                    }
                                >
                                    <a
                                        onClick={this.handleGetPublicLink}
                                        aria-label={''}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <i className='icon icon-link-variant'/>
                                    </a>
                                </OverlayTrigger>
                            </div>
                            <SizeAwareImage
                                onClick={this.handleImageClick}
                                className={minPreviewClass}
                                src={previewURL}
                                dimensions={this.state.dimensions}
                                fileInfo={this.props.fileInfo}
                                onImageLoaded={this.imageLoaded}
                                showLoader={this.props.isEmbedVisible}
                                handleSmallImageContainer={true}
                            />
                        </div>
                    </div>
                    }
                    {viewImageModal}
                </div>
            </div>
        );
    }
}
