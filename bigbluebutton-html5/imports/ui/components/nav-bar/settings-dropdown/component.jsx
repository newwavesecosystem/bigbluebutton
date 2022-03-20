import React, {PureComponent} from 'react';
import {defineMessages, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {withModalMounter} from '/imports/ui/components/common/modal/service';
import EndMeetingConfirmationContainer from '/imports/ui/components/end-meeting-confirmation/container';
import {makeCall} from '/imports/ui/services/api';
import AboutContainer from '/imports/ui/components/about/container';
import SettingsMenuContainer from '/imports/ui/components/settings/container';
import ShortcutHelpComponent from '/imports/ui/components/shortcut-help/component';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import FullscreenService from '/imports/ui/components/common/fullscreen-button/service';
import {colorDanger} from '/imports/ui/stylesheets/styled-components/palette';
import browserInfo from '/imports/utils/browserInfo';
import Button from "/imports/ui/components/common/button/component";
import Modal from '/imports/ui/components/common/modal/simple/component';

const intlMessages = defineMessages({
  optionsLabel: {
    id: 'app.navBar.settingsDropdown.optionsLabel',
    description: 'Options button label',
  },
  fullscreenLabel: {
    id: 'app.navBar.settingsDropdown.fullscreenLabel',
    description: 'Make fullscreen option label',
  },
  settingsLabel: {
    id: 'app.navBar.settingsDropdown.settingsLabel',
    description: 'Open settings option label',
  },
  aboutLabel: {
    id: 'app.navBar.settingsDropdown.aboutLabel',
    description: 'About option label',
  },
  aboutDesc: {
    id: 'app.navBar.settingsDropdown.aboutDesc',
    description: 'Describes about option',
  },
  leaveSessionLabel: {
    id: 'app.navBar.settingsDropdown.leaveSessionLabel',
    description: 'Leave session button label',
  },
  fullscreenDesc: {
    id: 'app.navBar.settingsDropdown.fullscreenDesc',
    description: 'Describes fullscreen option',
  },
  settingsDesc: {
    id: 'app.navBar.settingsDropdown.settingsDesc',
    description: 'Describes settings option',
  },
  leaveSessionDesc: {
    id: 'app.navBar.settingsDropdown.leaveSessionDesc',
    description: 'Describes leave session option',
  },
  exitFullscreenDesc: {
    id: 'app.navBar.settingsDropdown.exitFullscreenDesc',
    description: 'Describes exit fullscreen option',
  },
  exitFullscreenLabel: {
    id: 'app.navBar.settingsDropdown.exitFullscreenLabel',
    description: 'Exit fullscreen option label',
  },
  hotkeysLabel: {
    id: 'app.navBar.settingsDropdown.hotkeysLabel',
    description: 'Hotkeys options label',
  },
  hotkeysDesc: {
    id: 'app.navBar.settingsDropdown.hotkeysDesc',
    description: 'Describes hotkeys option',
  },
  helpLabel: {
    id: 'app.navBar.settingsDropdown.helpLabel',
    description: 'Help options label',
  },
  helpDesc: {
    id: 'app.navBar.settingsDropdown.helpDesc',
    description: 'Describes help option',
  },
  endMeetingLabel: {
    id: 'app.navBar.settingsDropdown.endMeetingLabel',
    description: 'End meeting options label',
  },
  endMeetingDesc: {
    id: 'app.navBar.settingsDropdown.endMeetingDesc',
    description: 'Describes settings option closing the current meeting',
  },
  endMeetingTitle: {
    id: 'app.endMeeting.title',
    description: 'end meeting title',
  },
  endMeetingDescription: {
    id: 'app.endMeeting.description',
    description: 'end meeting description with affected users information',
  },
  endMeetingNoUserDescription: {
    id: 'app.endMeeting.noUserDescription',
    description: 'end meeting description',
  },
  yesLabel: {
    id: 'app.endMeeting.yesLabel',
    description: 'label for yes button for end meeting',
  },
  noLabel: {
    id: 'app.endMeeting.noLabel',
    description: 'label for no button for end meeting',
  },
});

const propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  handleToggleFullscreen: PropTypes.func.isRequired,
  mountModal: PropTypes.func.isRequired,
  noIOSFullscreen: PropTypes.bool,
  amIModerator: PropTypes.bool,
  shortcuts: PropTypes.string,
  isBreakoutRoom: PropTypes.bool,
  isMeteorConnected: PropTypes.bool.isRequired,
  isDropdownOpen: PropTypes.bool,
  isMobile: PropTypes.bool.isRequired,
};

const defaultProps = {
  noIOSFullscreen: true,
  amIModerator: false,
  shortcuts: '',
  isBreakoutRoom: false,
  isDropdownOpen: false,
};

const ALLOW_FULLSCREEN = Meteor.settings.public.app.allowFullscreen;
const { isSafari } = browserInfo;
const FULLSCREEN_CHANGE_EVENT = isSafari ? 'webkitfullscreenchange' : 'fullscreenchange';

class SettingsDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFullscreen: false,
    };

    // Set the logout code to 680 because it's not a real code and can be matched on the other side
    this.LOGOUT_CODE = '680';

    this.leaveSession = this.leaveSession.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    this.reloadSession = this.reloadSession.bind(this);
    this.leavemeetingDialog = this.leavemeetingDialog.bind(this);
    this.reloadmeetingDialog = this.reloadmeetingDialog.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    document.documentElement.addEventListener(FULLSCREEN_CHANGE_EVENT, this.onFullscreenChange);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener(FULLSCREEN_CHANGE_EVENT, this.onFullscreenChange);
  }

  closeModal() {
    const {
      mountModal,
    } = this.props;

    return (
        mountModal(null)
    );
  }

  leavemeetingDialog() {
    const {
      intl,
    } = this.props;

    return (
        <Modal
            overlayClassName={styles.overlay}
            className={styles.modal}
            hideBorder
            shouldShowCloseButton={false}
            title="Leave"
        >
          <div className={styles.container}>
            <div className={styles.description}>
              Are you sure you want to leave the meeting
            </div>
            <div className={styles.footer}>
              <Button
                  data-test="confirmEndMeeting"
                  color="primary"
                  className={styles.button}
                  label={intl.formatMessage(intlMessages.yesLabel)}
                  onClick={() => this.leaveSession()}
              />
              <Button
                  label={intl.formatMessage(intlMessages.noLabel)}
                  className={styles.button}
                  onClick={() => this.closeModal()}
              />
            </div>
          </div>
        </Modal>
    );
  }

  reloadmeetingDialog() {
    const {
      intl,
    } = this.props;

    return (
        <Modal
            overlayClassName={styles.overlay}
            className={styles.modal}
            hideBorder
            shouldShowCloseButton={false}
            title="Reload meeting"
        >
          <div className={styles.container}>
            <div className={styles.description}>
              Are you sure you want to reload the meeting
            </div>
            <div className={styles.footer}>
              <Button
                  data-test="confirmReload"
                  color="primary"
                  className={styles.button}
                  label={intl.formatMessage(intlMessages.yesLabel)}
                  onClick={() => this.reloadSession()}
              />
              <Button
                  label={intl.formatMessage(intlMessages.noLabel)}
                  className={styles.button}
                  onClick={() => this.closeModal()}
              />
            </div>
          </div>
        </Modal>
    );
  }

  onFullscreenChange() {
    const {isFullscreen} = this.state;
    const newIsFullscreen = FullscreenService.isFullScreen(document.documentElement);
    if (isFullscreen !== newIsFullscreen) {
      this.setState({isFullscreen: newIsFullscreen});
    }
  }

  getFullscreenItem(menuItems) {
    const {
      intl,
      noIOSFullscreen,
      handleToggleFullscreen,
    } = this.props;
    const { isFullscreen } = this.state;

    if (noIOSFullscreen || !ALLOW_FULLSCREEN) return null;

    let fullscreenLabel = intl.formatMessage(intlMessages.fullscreenLabel);
    let fullscreenDesc = intl.formatMessage(intlMessages.fullscreenDesc);
    let fullscreenIcon = 'fullscreen';

    if (isFullscreen) {
      fullscreenLabel = intl.formatMessage(intlMessages.exitFullscreenLabel);
      fullscreenDesc = intl.formatMessage(intlMessages.exitFullscreenDesc);
      fullscreenIcon = 'exit_fullscreen';
    }

    return (
      menuItems.push(
        {
          key: 'list-item-fullscreen',
          icon: fullscreenIcon,
          label: fullscreenLabel,
          // description: fullscreenDesc,
          onClick: handleToggleFullscreen,
        },
      )
    );
  }

  showLogout() {
    const {
      intl, isMeteorConnected, mountModal,
    } = this.props;

    const {
      allowLogout: allowLogoutSetting,
    } = Meteor.settings.public.app;

    const logoutOption = (
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <Button
              label="Re-konn3ct"
              description="Reload meeting room"
              color="primary"
              size="sm"
              onClick={() => mountModal(this.reloadmeetingDialog())}
          />
          <Button
              label={intl.formatMessage(intlMessages.leaveSessionLabel)}
              description={intl.formatMessage(intlMessages.leaveSessionDesc)}
              color="danger"
              size="sm"
              onClick={() => mountModal(this.leavemeetingDialog())}
          />
        </div>
    );

    const shouldRenderLogoutOption = (isMeteorConnected && allowLogoutSetting)
        ? logoutOption
        : null;

    return (
        shouldRenderLogoutOption
    );
  }

  leaveSession() {
    makeCall('userLeftMeeting');
    // we don't check askForFeedbackOnLogout here,
    // it is checked in meeting-ended component
    Session.set('codeError', this.LOGOUT_CODE);
  }

  reloadSession() {
    location.reload();
  }

  renderMenuItems() {
    const {
      intl, mountModal, amIModerator, isBreakoutRoom, isMeteorConnected,
    } = this.props;

    const allowedToEndMeeting = amIModerator && !isBreakoutRoom;

    const {
      showHelpButton: helpButton,
      helpLink,
      allowLogout: allowLogoutSetting,
    } = Meteor.settings.public.app;

    this.menuItems = [];

    this.getFullscreenItem(this.menuItems);

    this.menuItems.push(
      {
        key: 'list-item-settings',
        icon: 'settings',
        dataTest: 'settings',
        label: intl.formatMessage(intlMessages.settingsLabel),
        // description: intl.formatMessage(intlMessages.settingsDesc),
        onClick: () => mountModal(<SettingsMenuContainer />),
      },
      {
        key: 'list-item-about',
        icon: 'about',
        label: intl.formatMessage(intlMessages.aboutLabel),
        // description: intl.formatMessage(intlMessages.aboutDesc),
        onClick: () => mountModal(<AboutContainer />),
      },
    );

    if (helpButton) {
      this.menuItems.push(
        {
          key: 'list-item-help',
          icon: 'help',
          iconRight: 'popout_window',
          label: intl.formatMessage(intlMessages.helpLabel),
          // description: intl.formatMessage(intlMessages.helpDesc),
          onClick: () => window.open(`${helpLink}`),
        },
      );
    }

    this.menuItems.push(
      {
        key: 'list-item-shortcuts',
        icon: 'shortcuts',
        label: intl.formatMessage(intlMessages.hotkeysLabel),
        // description: intl.formatMessage(intlMessages.hotkeysDesc),
        onClick: () => mountModal(<ShortcutHelpComponent />),
        divider: true,
      },
    );

    if (allowedToEndMeeting && isMeteorConnected) {
      this.menuItems.push(
        {
          key: 'list-item-end-meeting',
          icon: 'application',
          label: intl.formatMessage(intlMessages.endMeetingLabel),
          // description: intl.formatMessage(intlMessages.endMeetingDesc),
          onClick: () => mountModal(<EndMeetingConfirmationContainer />),
        },
      );
    }

    if (allowLogoutSetting && isMeteorConnected) {
      const customStyles = { color: colorDanger };

      this.menuItems.push(
        {
          key: 'list-item-logout',
          dataTest: 'logout',
          icon: 'logout',
          label: intl.formatMessage(intlMessages.leaveSessionLabel),
          // description: intl.formatMessage(intlMessages.leaveSessionDesc),
          customStyles,
          onClick: () => this.leaveSession(),
        },
      );
    }

    return this.menuItems;
  }

  render() {
    const {
      intl,
      shortcuts: OPEN_OPTIONS_AK,
      isDropdownOpen,
      isMobile,
    } = this.props;

    const customStyles = { top: '3rem' };

    return (
        this.showLogout()
        // <BBBMenu
        //   accessKey={OPEN_OPTIONS_AK}
        //   customStyles={!isMobile ? customStyles : null}
        //   trigger={(
        //     <Styled.DropdownButton
        //       state={isDropdownOpen ? 'open' : 'closed'}
        //       label={intl.formatMessage(intlMessages.optionsLabel)}
        //       icon="more"
        //       data-test="optionsButton"
        //       ghost
        //       circle
        //       hideLabel
        //       // FIXME: Without onClick react proptypes keep warning
        //       // even after the DropdownTrigger inject an onClick handler
        //       onClick={() => null}
        //     />
        //   )}
        //   actions={this.renderMenuItems()}
        // />
    );
  }
}
SettingsDropdown.propTypes = propTypes;
SettingsDropdown.defaultProps = defaultProps;
export default withShortcutHelper(withModalMounter(injectIntl(SettingsDropdown)), 'openOptions');
