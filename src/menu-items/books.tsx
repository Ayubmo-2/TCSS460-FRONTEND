// third-party
import { FormattedMessage } from 'react-intl';

// assets
import BookOutlined from '@ant-design/icons/BookOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { BookOutlined, MenuBookIcon, ListAltIcon, SearchIcon };

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
          url: '/books/search',
          icon: icons.SearchIcon
        },
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
        }
      ]
    }
  ]
};

export default books;
