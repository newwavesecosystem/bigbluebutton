import styled from 'styled-components';

import Button from '/imports/ui/components/common/button/component';
import {fontSizeBase} from '/imports/ui/stylesheets/styled-components/typography';
import {borderSize} from "/imports/ui/stylesheets/styled-components/general";
import {itemFocusBorder, listItemBgHover} from "/imports/ui/stylesheets/styled-components/palette";

const OptionsButton = styled(Button)`
  border-radius: 50%;
  display: block;
  padding: 0;
  margin: 0 0.25rem;

  span {
    padding: inherit;
  }

  i {
    font-size: ${fontSizeBase} !important;
  }
`;

const Messages = styled.div`
  flex-grow: 0;
  display: flex;
  flex-flow: column;
  flex-shrink: 0;
  max-height: 30vh;
`;

const ListItem = styled.div`
  display: flex;
  flex-flow: row;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  cursor: pointer;

  [dir="rtl"] & {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    outline: transparent;
    outline-style: dotted;
    outline-width: ${borderSize};
    background-color: ${listItemBgHover};
  }

  &:active,
  &:focus {
    outline: transparent;
    outline-width: ${borderSize};
    outline-style: solid;
    background-color: ${listItemBgHover};
    box-shadow: inset 0 0 0 ${borderSize} ${itemFocusBorder}, inset 1px 0 0 1px ${itemFocusBorder};
  }
`;


export default {
  OptionsButton,
  Messages,
  ListItem
};
