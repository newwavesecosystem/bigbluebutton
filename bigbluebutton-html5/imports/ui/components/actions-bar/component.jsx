import React, { PureComponent } from 'react';
import cx from 'classnames';
import { styles } from './styles.scss';
import ActionsDropdown from './actions-dropdown/container';
import ScreenshareButtonContainer from '/imports/ui/components/actions-bar/screenshare/container';
import AudioControlsContainer from '../audio/audio-controls/container';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import CaptionsButtonContainer from '/imports/ui/components/actions-bar/captions/container';
import PresentationOptionsContainer from './presentation-options/component';
import { ACTIONSBAR_HEIGHT } from '/imports/ui/components/layout/layout-manager';
import Button from '/imports/ui/components/button/component';
import { makeCall } from '/imports/ui/services/api';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import _ from 'lodash';
import EndMeetingConfirmationContainer from '/imports/ui/components/end-meeting-confirmation/container';
import UserOptionsContainer from "../user-list/user-list-content/user-participants/user-options/container";
import UserParticipants from "../user-list/user-list-content/user-participants/component";

const propTypes = {
  intl: PropTypes.object.isRequired,
  mountModal: PropTypes.func.isRequired,
};


const intlMessages = defineMessages({
  selectleaveSessionLabel: {
    id: 'app.navBar.settingsDropdown.leaveSessionLabel',
    description: 'Leave session button label',
  },
  selectleaveSessionDesc: {
    id: 'app.navBar.settingsDropdown.leaveSessionDesc',
    description: 'Describes leave session option',
  },
  endMeetingLabel: {
    id: 'app.navBar.settingsDropdown.endMeetingLabel',
    description: 'End meeting options label',
  },
  endMeetingDesc: {
    id: 'app.navBar.settingsDropdown.endMeetingDesc',
    description: 'Describes settings option closing the current meeting',
  },
});

class ActionsBar extends PureComponent {
  constructor(props) {
    super(props);

    this.selectLeaveMeeting = _.uniqueId('action-item-');
    this.endLeaveMeeting = _.uniqueId('action-item-');
    // Set the logout code to 680 because it's not a real code and can be matched on the other side
    this.LOGOUT_CODE = '680';

    this.leaveSession = this.leaveSession.bind(this);
  }

  leaveSession() {
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', this.LOGOUT_CODE);
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }
  render() {
    const {
      amIPresenter,
      amIModerator,
      enableVideo,
      isLayoutSwapped,
      toggleSwapLayout,
      handleTakePresenter,
      intl,
      isSharingVideo,
      stopExternalVideoShare,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isPresentationDisabled,
      isThereCurrentPresentation,
      allowExternalVideo,
      isBreakoutRoom,
      mountModal,
    } = this.props;

    const actionBarClasses = {};

    actionBarClasses[styles.centerWithActions] = amIPresenter;
    actionBarClasses[styles.center] = true;
    actionBarClasses[styles.mobileLayoutSwapped] = isLayoutSwapped && amIPresenter;

    const allowedToEndMeeting = amIModerator && !isBreakoutRoom && isMeteorConnected;

    return (
      <div
        className={styles.actionsbar}
        style={{
          height: ACTIONSBAR_HEIGHT,
        }}
      >
        <div className={styles.left}>
          <ActionsDropdown {...{
            amIPresenter,
            amIModerator,
            isPollingEnabled,
            allowExternalVideo,
            handleTakePresenter,
            intl,
            isSharingVideo,
            stopExternalVideoShare,
            isMeteorConnected,
          }}
          />
          {isCaptionsAvailable
            ? (
              <CaptionsButtonContainer {...{ intl }} />
            )
            : null
          }
        </div>
        <div>
          <Button
              hideLabel
              label={intl.formatMessage(intlMessages.selectleaveSessionLabel)}
              description={intl.formatMessage(intlMessages.selectleaveSessionDesc)}
              icon="logout"
              color="danger"
              size="lg"
              circle
              onClick={() => this.leaveSession()}
          />

          (allowedToEndMeeting
          ?
          (<Button
            icon="application"
            label={intl.formatMessage(intlMessages.endMeetingLabel)}
            description={intl.formatMessage(intlMessages.endMeetingDesc)}
            key={this.endLeaveMeeting}
            onClick={() => mountModal(<EndMeetingConfirmationContainer />)}
        />
          ):null
          ),

        </div>
        {/*<div>*/}
        {/*  {currentUser.role === ROLE_MODERATOR*/}
        {/*      ? (*/}
        {/*          <UserOptionsContainer {...{*/}
        {/*            users,*/}
        {/*            setEmojiStatus,*/}
        {/*            meetingIsBreakout,*/}
        {/*          }}*/}
        {/*          />*/}
        {/*      ) : null*/}
        {/*  }*/}
        {/*</div>*/}
        <div className={cx(actionBarClasses)}>
          <AudioControlsContainer />
          {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
          <ScreenshareButtonContainer {...{
            amIPresenter,
            isMeteorConnected,
          }}
          />
        </div>
        <div className={styles.right}>
          {isLayoutSwapped && !isPresentationDisabled
            ? (
              <PresentationOptionsContainer
                toggleSwapLayout={toggleSwapLayout}
                isThereCurrentPresentation={isThereCurrentPresentation}
              />
            )
            : null
          }
        </div>
      </div>
    );
  }
}

ActionsBar.propTypes = propTypes;

export default ActionsBar;
