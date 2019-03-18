// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {get} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {selectPost} from 'actions/views/rhs';
import {Preferences} from 'utils/constants.jsx';

import Post from './post.jsx';

function mapStateToProps(state, ownProps) {
    const detailedPost = ownProps.post || {};

    const config = getConfig(state);
    const enableClickToReply = config.ExperimentalEnableClickToReply === 'true';

    return {
        post: getPost(state, detailedPost.id),
        currentUserId: getCurrentUserId(state),
        isFirstReply: Boolean(detailedPost.isFirstReply && detailedPost.commentedOnPost),
        highlight: detailedPost.highlight,
        consecutivePostByUser: detailedPost.consecutivePostByUser,
        previousPostIsComment: detailedPost.previousPostIsComment,
        replyCount: detailedPost.replyCount,
        isCommentMention: detailedPost.isCommentMention,
        center: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CHANNEL_DISPLAY_MODE, Preferences.CHANNEL_DISPLAY_MODE_DEFAULT) === Preferences.CHANNEL_DISPLAY_MODE_CENTERED,
        compactDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.MESSAGE_DISPLAY, Preferences.MESSAGE_DISPLAY_DEFAULT) === Preferences.MESSAGE_DISPLAY_COMPACT,
        enableClickToReply,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            selectPost,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
