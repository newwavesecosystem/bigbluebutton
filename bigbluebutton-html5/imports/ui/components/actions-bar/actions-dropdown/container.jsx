import { withTracker } from 'meteor/react-meteor-data';
import Presentations from '/imports/api/presentations';
import PresentationUploaderService from '/imports/ui/components/presentation/presentation-uploader/service';
import PresentationPodService from '/imports/ui/components/presentation-pod/service';
import ActionsDropdown from './component';

import {setUserSelectedListenOnly, setUserSelectedMicrophone} from "../../audio/audio-modal/service";
import Service from "../../audio/service";
import AppService from '/imports/ui/components/app/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
const APP_CONFIG = Meteor.settings.public.app;
import Storage from '/imports/ui/services/storage/session';

const handleLeaveAudio = () => {
  const meetingIsBreakout = AppService.meetingIsBreakout();

  if (!meetingIsBreakout) {
    setUserSelectedMicrophone(false);
    setUserSelectedListenOnly(false);
  }

  const skipOnFistJoin = getFromUserSettings('bbb_skip_check_audio_on_first_join', APP_CONFIG.skipCheckOnJoin);
  if (skipOnFistJoin) {
    Storage.setItem('getEchoTest', true);
  }

  Service.exitAudio();
  logger.info({
    logCode: 'audiocontrols_leave_audio',
    extraInfo: { logType: 'user_action' },
  }, 'audio connection closed by user');
};

export default withTracker(() => {
  const presentations = Presentations.find({ 'conversion.done': true }).fetch();
  return ({
    presentations,
    setPresentation: PresentationUploaderService.setPresentation,
    podIds: PresentationPodService.getPresentationPodIds(),
    handleLeaveAudio,
  });
})(ActionsDropdown);
