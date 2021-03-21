import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import { styles } from './styles.scss';
import CustomLogo from './custom-logo/component';
import UserContentContainer from './user-list-content/container';
import SettingsMenuContainer from '/imports/ui/components/settings/container';
import Button from '/imports/ui/components/button/component';

const propTypes = {
  compact: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  CustomLogoUrl: PropTypes.string.isRequired,
  isPublicChat: PropTypes.func.isRequired,
  setEmojiStatus: PropTypes.func.isRequired,
  roving: PropTypes.func.isRequired,
  showBranding: PropTypes.bool.isRequired,
  requestUserInformation: PropTypes.func.isRequired,
  mountModal: PropTypes.func.isRequired,
};

const defaultProps = {
  compact: false,
};

class UserList extends PureComponent {
  render() {
    const {
      intl,
      compact,
      setEmojiStatus,
      isPublicChat,
      roving,
      CustomLogoUrl,
      showBranding,
      hasBreakoutRoom,
      requestUserInformation,
      mountModal
    } = this.props;

    return (
      <div className={styles.userList}>
        {
          showBranding
            && !compact
            && CustomLogoUrl
            ? <CustomLogo CustomLogoUrl={CustomLogoUrl} /> : null
        }

        <Button
            label="Settings"
            data-test="sett"
            icon="settings"
            color="dark"
            size="lg"
            onClick={() => mountModal(<SettingsMenuContainer />)}
        />

        {<UserContentContainer
          {...{
            intl,
            compact,
            setEmojiStatus,
            isPublicChat,
            roving,
            hasBreakoutRoom,
            requestUserInformation,
          }
          }
        />}
      </div>
    );
  }
}

UserList.propTypes = propTypes;
UserList.defaultProps = defaultProps;

export default injectWbResizeEvent(injectIntl(UserList));
