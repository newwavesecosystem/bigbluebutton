import React from 'react';
import PropTypes from 'prop-types';
import Icon from '/imports/ui/components/icon/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { styles } from './styles';

const propTypes = {
  icon: PropTypes.string.isRequired,
};

const defaultProps = {
};

const ChatIcon = (props) => (
  <div className={styles.chatThumbnail}>
    {/* <Icon iconName={props.icon} /> */}
    <FontAwesomeIcon icon={faCommentDots} size="lg" style={{ color: 'green' }} />
  </div>
);

ChatIcon.propTypes = propTypes;
ChatIcon.defaultProps = defaultProps;

export default ChatIcon;
