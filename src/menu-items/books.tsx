// third-party
import { FormattedMessage } from 'react-intl';

// assets
import BookOutlined from '@ant-design/icons/BookOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { BookOutlined, MenuBookIcon, ListAltIcon, SearchIcon, AddIcon };

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
          id: 'search-books',
          title: <FormattedMessage id="search-books" />,
          type: 'item',
          url: '/Books/search',
          icon: icons.SearchIcon
        },
        {
          id: 'view-book',
          title: <FormattedMessage id="view-book" />,
          type: 'item',
          url: '/Books/view',
          icon: icons.MenuBookIcon
        },
        {
          id: 'list-books',
          title: <FormattedMessage id="list-books" />,
          type: 'item',
          url: '/Books/list',
          icon: icons.ListAltIcon
        },
        {
          id: 'create-book',
          title: <FormattedMessage id="create-book" />,
          type: 'item',
          url: '/Books/create',
          icon: icons.AddIcon
        }
      ]
    }
  ]
};

export default books;
