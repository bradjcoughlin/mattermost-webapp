// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {toggleEmbedVisibility} from 'actions/post_actions';

import {getIsRhsOpen} from 'selectors/rhs';

import SingleImageView from 'components/single_image_view/single_image_view.jsx';

function mapStateToProps(state) {
    const isRhsOpen = getIsRhsOpen(state);
    const config = getConfig(state);

    return {
        isRhsOpen,
        enablePublicLink: config.EnablePublicLink === 'true',
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            toggleEmbedVisibility,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleImageView);
