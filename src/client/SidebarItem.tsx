import {
  ListItem,
  darken,
  styled,
  ListItemProps,
  ButtonBase,
  alpha,
} from "@mui/material";

const SidebarItem = styled(
  (props: ListItemProps) => <ListItem component={ButtonBase} {...props} />,
  { shouldForwardProp: (propName) => propName !== "isSelected" }
)<{ isSelected?: boolean }>(({ theme, isSelected }) =>
  isSelected
    ? {
        "&, &:focus": {
          background: alpha(darken(theme.palette.background.paper, 0.2), 0.3),
        },
        "&:hover": {
          background: alpha(darken(theme.palette.background.paper, 0.25), 0.3),
        },
      }
    : {
        "&:hover": {
          background: alpha(darken(theme.palette.background.paper, 0.1), 0.3),
        },
      }
);

export default SidebarItem;
