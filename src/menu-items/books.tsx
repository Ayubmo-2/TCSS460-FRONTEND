// third-party
import { FormattedMessage } from 'react-intl';

// assets
import BookOutlined from '@ant-design/icons/BookOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { BookOutlined, MenuBookIcon, ListAltIcon, AddCircleOutlineIcon, DeleteOutlineIcon };

// ==============================|| MENU ITEMS - BOOKS ||============================== //

const books: NavItemType = {
  id: 'group-books',
  title: <FormattedMessage id="books" />,
  type: 'group',
  children: [
    {
      id: 'books',
      title: <FormattedMessage id="books" />,
      type: 'collapse',
      icon: icons.BookOutlined,
      children: [
        {
          id: 'view-book',
          title: <FormattedMessage id="view-book" />,
          type: 'item',
          url: '/books/view',
          icon: icons.MenuBookIcon
        },
        {
          id: 'list-books',
          title: <FormattedMessage id="list-books" />,
          type: 'item',
          url: '/books/list',
          icon: icons.ListAltIcon
        },
        {
          id: 'create-book',
          title: <FormattedMessage id="create-book" />,
          type: 'item',
          url: '/books/create',
          icon: icons.AddCircleOutlineIcon
        },
        {
          id: 'delete-book',
          title: <FormattedMessage id="delete-book" />,
          type: 'item',
          url: '/books/delete',
          icon: icons.DeleteOutlineIcon
        }
      ]
    }
  ]
};

export default books;
