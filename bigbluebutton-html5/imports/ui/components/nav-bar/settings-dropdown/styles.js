import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import Button from '/imports/ui/components/common/button/component';
import {mdPaddingX} from "/imports/ui/stylesheets/styled-components/general";

const DropdownButton = styled(Button)`
  ${({ state }) => state === 'open' && `
    @media ${smallOnly} {
      display: none;
    }
  `}

  ${({state}) => state === 'closed' && `
    margin: 0;
    z-index: 3;
  `}
`;
const StartButton = styled(Button)`
  display: flex;
  align-self: center;

  &:focus {
    outline: none !important;
  }

  & > i {
    color: #3c5764;
  }

  margin: 0;
  display: block;
  position: absolute;
  bottom: ${mdPaddingX};
`;

export default {
  DropdownButton,
  StartButton
};
