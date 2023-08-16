import styled from 'styled-components';

import Button from '/imports/ui/components/common/button/component';
import {fontSizeBase, fontSizeSmall} from '/imports/ui/stylesheets/styled-components/typography';
import {ScrollboxVertical} from "/imports/ui/stylesheets/styled-components/scrollable";
import {
  colorGrayDark, colorGrayLight,
  colorOffWhite,
  colorPrimary, itemFocusBorder, listItemBgHover,
  userListBg
} from "/imports/ui/stylesheets/styled-components/palette";
import {
  borderSize,
  lgPaddingY,
  mdPaddingX,
  mdPaddingY,
  smPaddingX
} from "/imports/ui/stylesheets/styled-components/general";
import Styled from "/imports/ui/components/user-list/styles";

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

const SamjiOptionsButton = styled.div`
  flex-grow: 0;
  display: flex;
  flex-flow: column;
  flex-shrink: 0;
  max-height: 30vh;
`;

const Messages = styled.div`
  flex-grow: 0;
  display: flex;
  flex-flow: column;
  flex-shrink: 0;
  max-height: 30vh;
`;

const ScrollableList = styled(ScrollboxVertical)`
  background: linear-gradient(${userListBg} 30%, rgba(255,255,255,0)),
    linear-gradient(rgba(255,255,255,0), ${userListBg} 70%) 0 100%,
    /* Shadows */
    radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0)),
    radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;

  outline: none;
  
  &:hover {
    /* Visible in Windows high-contrast themes */
    outline: transparent;
    outline-style: dotted;
    outline-width: ${borderSize};
  }

  &:focus,
  &:active {
    border-radius: none;
    box-shadow: inset 0 0 1px ${colorPrimary};
    outline-style: transparent;
  }

  overflow-x: hidden;
  padding-top: 1px;
  padding-right: 1px;
`;

const List = styled.div`
  margin: 0 0 1px ${mdPaddingY};

  [dir="rtl"] & {
    margin: 0 ${mdPaddingY} 1px 0;
  }
`;

const ListItem = styled(Styled.ListItem)`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-flow: row;
  flex-grow: 0;
  flex-shrink: 0;
  padding-top: ${lgPaddingY};
  padding-bottom: ${lgPaddingY};
  padding-left: ${lgPaddingY};
  text-decoration: none;
  width: 100%;
  color: ${colorGrayDark};
  background-color: ${colorOffWhite};

  [dir="rtl"]  & {
    padding-right: ${lgPaddingY};
    padding-left: 0;
  }

  > i {
    display: flex;
    font-size: 175%;
    color: ${colorGrayLight};
    flex: 0 0 2.2rem;
    margin-right: ${smPaddingX};
    [dir="rtl"]  & {
      margin-right: 0;
      margin-left: ${smPaddingX};
    }
  }

  > span {
    font-weight: 400;
    font-size: ${fontSizeSmall};
    color: ${colorGrayDark};
    position: relative;
    flex-grow: 1;
    line-height: 2;
    text-align: left;
    padding-left: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    [dir="rtl"] & {
      text-align: right;
      padding-right: ${mdPaddingX};
    }
  }

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:active {
    background-color: ${listItemBgHover};
    box-shadow: inset 0 0 0 ${borderSize} ${itemFocusBorder}, inset 1px 0 0 1px ${itemFocusBorder};
  }
`;


export default {
  OptionsButton,
  SamjiOptionsButton,
  ScrollableList,
  List,
  ListItem,
  Messages
};
