import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import { makeCall } from '/imports/ui/services/api';
import Button from '/imports/ui/components/button/component';
import { withModalMounter } from '/imports/ui/components/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import ExternalVideoModal from '/imports/ui/components/external-video-player/modal/container';
import RandomUserSelectContainer from '/imports/ui/components/modal/random-user/container';
import BBBMenu from '/imports/ui/components/menu/component';
import cx from 'classnames';
import EndMeetingConfirmationContainer from '/imports/ui/components/end-meeting-confirmation/container';
import SettingsMenuContainer from '/imports/ui/components/settings/container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp, faBars } from '@fortawesome/free-solid-svg-icons';
import { Session } from 'meteor/session';
import { styles } from '../styles';
import { PANELS, ACTIONS } from '../../layout/enums';

const propTypes = {
  amIPresenter: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  mountModal: PropTypes.func.isRequired,
  amIModerator: PropTypes.bool.isRequired,
  shortcuts: PropTypes.string,
  handleTakePresenter: PropTypes.func.isRequired,
  allowExternalVideo: PropTypes.bool.isRequired,
  stopExternalVideoShare: PropTypes.func.isRequired,
  isBreakoutRoom: PropTypes.bool,
  isMeteorConnected: PropTypes.bool.isRequired,
};

const defaultProps = {
  shortcuts: '',
};

const intlMessages = defineMessages({
  actionsLabel: {
    id: 'app.actionsBar.actionsDropdown.actionsLabel',
    description: 'Actions button label',
  },
  presentationLabel: {
    id: 'app.actionsBar.actionsDropdown.presentationLabel',
    description: 'Upload a presentation option label',
  },
  presentationDesc: {
    id: 'app.actionsBar.actionsDropdown.presentationDesc',
    description: 'adds context to upload presentation option',
  },
  desktopShareDesc: {
    id: 'app.actionsBar.actionsDropdown.desktopShareDesc',
    description: 'adds context to desktop share option',
  },
  stopDesktopShareDesc: {
    id: 'app.actionsBar.actionsDropdown.stopDesktopShareDesc',
    description: 'adds context to stop desktop share option',
  },
  pollBtnLabel: {
    id: 'app.actionsBar.actionsDropdown.pollBtnLabel',
    description: 'poll menu toggle button label',
  },
  pollBtnDesc: {
    id: 'app.actionsBar.actionsDropdown.pollBtnDesc',
    description: 'poll menu toggle button description',
  },
  takePresenter: {
    id: 'app.actionsBar.actionsDropdown.takePresenter',
    description: 'Label for take presenter role option',
  },
  takePresenterDesc: {
    id: 'app.actionsBar.actionsDropdown.takePresenterDesc',
    description: 'Description of take presenter role option',
  },
  startExternalVideoLabel: {
    id: 'app.actionsBar.actionsDropdown.shareExternalVideo',
    description: 'Start sharing external video button',
  },
  stopExternalVideoLabel: {
    id: 'app.actionsBar.actionsDropdown.stopShareExternalVideo',
    description: 'Stop sharing external video button',
  },
  selectRandUserLabel: {
    id: 'app.actionsBar.actionsDropdown.selectRandUserLabel',
    description: 'Label for selecting a random user',
  },
  selectRandUserDesc: {
    id: 'app.actionsBar.actionsDropdown.selectRandUserDesc',
    description: 'Description for select random user option',
  },
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
  settingsLabel: {
    id: 'app.navBar.settingsDropdown.settingsLabel',
    description: 'Open settings option label',
  },
  settingsDesc: {
    id: 'app.navBar.settingsDropdown.settingsDesc',
    description: 'Describes settings option',
  },
  panelLabel: {
    id: 'app.navBar.settingsDropdown.panelLabel',
    description: 'Open panel option label',
  },
  panelDesc: {
    id: 'app.navBar.settingsDropdown.panelDesc',
    description: 'Describes panel option',
  },
  audiochangeLabel: {
    id: 'app.navBar.settingsDropdown.audiochangeLabel',
    description: 'Audiochange option label',
  },
  audiochangeDesc: {
    id: 'app.navBar.settingsDropdown.audiochangeDesc',
    description: 'Describes audiochange option',
  },
});

const handlePresentationClick = () => Session.set('showUploadPresentationView', true);

class ActionsDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.presentationItemId = _.uniqueId('action-item-');
    this.pollId = _.uniqueId('action-item-');
    this.panel = _.uniqueId('action-item-');
    this.takePresenterId = _.uniqueId('action-item-');
    this.selectUserRandId = _.uniqueId('action-item-');
    this.selectLeaveMeeting = _.uniqueId('action-item-');
    this.endLeaveMeeting = _.uniqueId('action-item-');
    this.selectSettings = _.uniqueId('action-item-');
    // Set the logout code to 680 because it's not a real code and can be matched on the other side
    this.LOGOUT_CODE = '680';

    this.handleExternalVideoClick = this.handleExternalVideoClick.bind(this);
    this.makePresentationItems = this.makePresentationItems.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleToggleUserList = this.handleToggleUserList.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { amIPresenter: wasPresenter } = prevProps;
    const { amIPresenter: isPresenter, mountModal } = this.props;
    if (wasPresenter && !isPresenter) {
      mountModal(null);
    }
  }

  handleExternalVideoClick() {
    const { mountModal } = this.props;
    mountModal(<ExternalVideoModal />);
  }

  getAvailableActions() {
    const {
      intl,
      amIPresenter,
      allowExternalVideo,
      handleTakePresenter,
      isSharingVideo,
      isPollingEnabled,
      isSelectRandomUserEnabled,
      stopExternalVideoShare,
      mountModal,
      layoutContextDispatch,
      hidePresentation,
      isMeteorConnected,
      amIModerator,
      isBreakoutRoom,
    } = this.props;

    const {
      pollBtnLabel,
      presentationLabel,
      takePresenter,
    } = intlMessages;

    const {
      formatMessage,
    } = intl;

    const {
      allowLogout: allowLogoutSetting,
    } = Meteor.settings.public.app;

    const allowedToEndMeeting = amIModerator && !isBreakoutRoom && isMeteorConnected;

    const shouldRenderLogoutOption = isMeteorConnected && allowLogoutSetting;


    const actions = [];

    if (amIPresenter && !hidePresentation) {
      actions.push({
        icon: "presentation",
        dataTest: "uploadPresentation",
        label: formatMessage(presentationLabel),
        key: this.presentationItemId,
        onClick: handlePresentationClick,
        dividerTop: this.props?.presentations?.length > 1 ? true : false,
      })
    }

    if (amIPresenter && isPollingEnabled) {
      actions.push({
        icon: "polling",
        dataTest: "polling",
        label: formatMessage(pollBtnLabel),
        key: this.pollId,
        onClick: () => {
          if (Session.equals('pollInitiated', true)) {
            Session.set('resetPollPanel', true);
          }
          layoutContextDispatch({
            type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
            value: true,
          });
          layoutContextDispatch({
            type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
            value: PANELS.POLL,
          });
          Session.set('forcePollOpen', true);
        },
      })
    }

    if (!amIPresenter) {
      actions.push({
        icon: "presentation",
        label: formatMessage(takePresenter),
        key: this.takePresenterId,
        onClick: () => handleTakePresenter(),
      });
    }

    if (amIPresenter && allowExternalVideo) {
      actions.push({
        icon: !isSharingVideo ? "external-video" : "external-video_off",
        label: !isSharingVideo ? intl.formatMessage(intlMessages.startExternalVideoLabel)
          : intl.formatMessage(intlMessages.stopExternalVideoLabel),
        key: "external-video",
        onClick: isSharingVideo ? stopExternalVideoShare : this.handleExternalVideoClick,
      })
    }

    if (amIPresenter && isSelectRandomUserEnabled) {
      actions.push({
        icon: "user",
        label: intl.formatMessage(intlMessages.selectRandUserLabel),
        key: this.selectUserRandId,
        onClick: () => mountModal(<RandomUserSelectContainer isSelectedUser={false} />),
      })
    }

    if (shouldRenderLogoutOption) {
      actions.push({
        icon: "logout",
        label: intl.formatMessage(intlMessages.selectleaveSessionLabel),
        key: this.selectLeaveMeeting,
        onClick: () => this.leaveSession(),
      })
    }


    if (allowedToEndMeeting) {
      actions.push({
        icon: "application",
        label: intl.formatMessage(intlMessages.endMeetingLabel),
        key: this.endLeaveMeeting,
        onClick: () => mountModal(<EndMeetingConfirmationContainer />),
      })
    }

    actions.push({
      icon: "settings",
      label: intl.formatMessage(intlMessages.settingsLabel),
      key: this.endLeaveMeeting,
      onClick: () => mountModal(<SettingsMenuContainer />),
    })

    return actions;
  }

  makePresentationItems() {
    const {
      presentations,
      setPresentation,
      podIds,
    } = this.props;

    if (!podIds || podIds.length < 1) return [];

    // We still have code for other pods from the Flash client. This intentionally only cares
    // about the first one because it's the default.
    const { podId } = podIds[0];

    const presentationItemElements = presentations
      .sort((a, b) => (a.name.localeCompare(b.name)))
      .map((p) => {
        const itemStyles = {};
        itemStyles[styles.presentationItem] = true;
        itemStyles[styles.isCurrent] = p.current;

        return (
          {
            className: cx(itemStyles),
            icon: "file",
            iconRight: p.current ? 'check' : null,
            label: p.name,
            description: "uploaded presentation file",
            key: `uploaded-presentation-${p.id}`,
            onClick: () => {
              setPresentation(p.id, podId);
            },
          }
        );
      });

    return presentationItemElements;
  }

  leaveSession() {
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', this.LOGOUT_CODE);
    // mountModal(<MeetingEndedComponent code={LOGOUT_CODE} />);
  }

  handleToggleUserList() {
    Session.set(
      'openPanel',
      Session.get('openPanel') !== ''
        ? ''
        : 'userlist',
    );
    Session.set('idChatOpen', '');

    window.dispatchEvent(new Event('panelChanged'));
  }

  render() {
    const {
      intl,
      amIPresenter,
      amIModerator,
      shortcuts: OPEN_ACTIONS_AK,
      isMeteorConnected,
      isDropdownOpen,
    } = this.props;

    const availableActions = this.getAvailableActions();
    const availablePresentations = this.makePresentationItems();
    const children = availablePresentations.length > 1 && amIPresenter
      ? availablePresentations.concat(availableActions) : availableActions;

    if ((!amIPresenter && !amIModerator)
      || availableActions.length === 0
      || !isMeteorConnected) {
      return null;
    }
    const arrowUp = <FontAwesomeIcon icon={faAngleDoubleUp} size="lg" />;
    return (
      <BBBMenu
        classes={[styles.offsetBottom]}
        accessKey={OPEN_ACTIONS_AK}
        trigger={
          <Button
            className={isDropdownOpen ? styles.hideDropdownButton : ''}
            hideLabel
            aria-label={intl.formatMessage(intlMessages.actionsLabel)}
            label={intl.formatMessage(intlMessages.actionsLabel)}
            // icon="plus"
            // color="primary"
            size="lg"
            circle
            onClick={() => null}
            customIcon={arrowUp}
            color="default"
          />
        }
        actions={children}
        opts={{
          disablePortal: true,
          id: "default-dropdown-menu",
          keepMounted: true,
          transitionDuration: 0,
          elevation: 3,
          getContentAnchorEl: null,
          fullwidth: "true",
          anchorOrigin: { vertical: 'top', horizontal: 'left' },
          transformorigin: { vertical: 'top', horizontal: 'left' },
        }}
      />
    );
  }
}

ActionsDropdown.propTypes = propTypes;
ActionsDropdown.defaultProps = defaultProps;

export default withShortcutHelper(withModalMounter(ActionsDropdown), 'openActions');
