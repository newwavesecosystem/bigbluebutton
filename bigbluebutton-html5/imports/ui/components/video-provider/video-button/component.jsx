import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { defineMessages, injectIntl } from 'react-intl';
import { validIOSVersion } from '/imports/ui/components/app/service';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import { styles } from './styles';
import VideoService from '../service';

const intlMessages = defineMessages({
  joinVideo: {
    id: 'app.video.joinVideo',
    description: 'Join video button label',
  },
  leaveVideo: {
    id: 'app.video.leaveVideo',
    description: 'Leave video button label',
  },
  videoLocked: {
    id: 'app.video.videoLocked',
    description: 'video disabled label',
  },
  videoConnecting: {
    id: 'app.video.connecting',
    description: 'video connecting label',
  },
  dataSaving: {
    id: 'app.video.dataSaving',
    description: 'video data saving label',
  },
  meteorDisconnected: {
    id: 'app.video.clientDisconnected',
    description: 'Meteor disconnected label',
  },
  iOSWarning: {
    id: 'app.iOSWarning.label',
    description: 'message indicating to upgrade ios version',
  },
});

const JOIN_VIDEO_DELAY_MILLISECONDS = 500;

const propTypes = {
  intl: PropTypes.object.isRequired,
  hasVideoStream: PropTypes.bool.isRequired,
  mountVideoPreview: PropTypes.func.isRequired,
};

const JoinVideoButton = ({
  intl,
  hasVideoStream,
  disableReason,
  mountVideoPreview,
}) => {
  const exitVideo = () => hasVideoStream && !VideoService.isMultipleCamerasEnabled();

  const handleOnClick = debounce(() => {
    if (!validIOSVersion()) {
      return VideoService.notify(intl.formatMessage(intlMessages.iOSWarning));
    }

    if (exitVideo()) {
      VideoService.exitVideo();
    } else {
      mountVideoPreview();
    }
  }, JOIN_VIDEO_DELAY_MILLISECONDS);

  let label = exitVideo()
    ? intl.formatMessage(intlMessages.leaveVideo)
    : intl.formatMessage(intlMessages.joinVideo);

  if (disableReason) label = intl.formatMessage(intlMessages[disableReason]);

  const videoOff = <FontAwesomeIcon icon={faVideoSlash} size="lg" />;
  const videoOn = <FontAwesomeIcon icon={faVideo} size="lg" />;

  return (
    <Button
      label={label}
      data-test={hasVideoStream ? 'leaveVideo' : 'joinVideo'}
      className={cx(hasVideoStream || styles.btn)}
      onClick={handleOnClick}
      hideLabel
      color="default"
      customIcon={hasVideoStream ? videoOn : videoOff}
      ghost={!hasVideoStream}
      size="lg"
      circle
      disabled={!!disableReason}
    />
  );
};

JoinVideoButton.propTypes = propTypes;

export default injectIntl(memo(JoinVideoButton));
