import './index.css'

const DishCategoryTab = props => {
  const {data, changeCat, displayCat} = props
  return (
    <nav className="menu-categories-nav">
      {data.length > 0 &&
        data[0].table_menu_list.map(each => (
          <button
            key={each.menu_category_id}
            type="button"
            className={`category-button ${
              displayCat === each.menu_category_id ? 'active' : ''
            }`}
            onClick={() => changeCat(each.menu_category_id)}
          >
            {each.menu_category}
          </button>
        ))}
    </nav>
  )
}

export default DishCategoryTab
