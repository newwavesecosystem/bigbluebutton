import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import MediaService from '/imports/ui/components/media/service';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinusSquare, faShareSquare, faVideo, faVideoSlash} from "@fortawesome/free-solid-svg-icons";

const propTypes = {
  intl: PropTypes.object.isRequired,
  toggleSwapLayout: PropTypes.func.isRequired,
};

const intlMessages = defineMessages({
  restorePresentationLabel: {
    id: 'app.actionsBar.actionsDropdown.restorePresentationLabel',
    description: 'Restore Presentation option label',
  },
  restorePresentationDesc: {
    id: 'app.actionsBar.actionsDropdown.restorePresentationDesc',
    description: 'button to restore presentation after it has been closed',
  },
});

const shouldUnswapLayout = () => MediaService.shouldShowScreenshare() || MediaService.shouldShowExternalVideo();

const shareOff = <FontAwesomeIcon icon={faShareSquare} size="lg" />;
const shareOn = <FontAwesomeIcon icon={faMinusSquare} size="lg" />;

const PresentationOptionsContainer = ({ intl, toggleSwapLayout, isThereCurrentPresentation }) => {
  if (shouldUnswapLayout()) toggleSwapLayout();
  return (
    <Button
      customIcon={shareOff}
      data-test="restorePresentationButton"
      label={intl.formatMessage(intlMessages.restorePresentationLabel)}
      description={intl.formatMessage(intlMessages.restorePresentationDesc)}
      color="default"
      hideLabel
      circle
      size="lg"
      onClick={toggleSwapLayout}
      id="restore-presentation"
      disabled={!isThereCurrentPresentation}
    />
  );
};

PresentationOptionsContainer.propTypes = propTypes;
export default injectIntl(PresentationOptionsContainer);
