import {Component} from 'react'
import './App.css'

const DisplayList = props => {
  const {details, ondecreaseQuantity, onincreaseQuantity} = props
  const {
    id,
    dishName,
    dishCurrency,
    dishDescription,
    dishCalories,
    dishImage,
    quantity,
    dishPrice,
    dishAvailability,
    addonCat,
  } = details

  const increaseFun = () => {
    onincreaseQuantity(id)
  }
  const decreaseFun = () => {
    ondecreaseQuantity(id)
  }

  return (
    <div className="dish-item">
      <div className="dish-details-container">
        <h1 className="dish-name">{dishName}</h1>
        <p className="dish-price">
          {dishCurrency} {dishPrice}
        </p>
        <p className="dish-description">{dishDescription}</p>
        <p className="dish-calories">{dishCalories} calories</p>
        {dishAvailability ? (
          <div className="quantity-controls">
            <button
              type="button"
              onClick={decreaseFun}
              className="quantity-button"
            >
              -
            </button>
            <p className="dish-quantity">{quantity}</p>
            <button
              type="button"
              onClick={increaseFun}
              className="quantity-button"
            >
              +
            </button>
            {addonCat.length > 0 && (
              <p className="customizations-text">Customizations available</p>
            )}
          </div>
        ) : (
          <p className="not-available-text">Not available</p>
        )}
      </div>
      <div className="dish-image-container">
        <img className="dish-image" alt={dishName} src={dishImage} />
      </div>
    </div>
  )
}

class App extends Component {
  state = {data: [], displayCat: '', cartQuantity: 0, quantityList: []}

  componentDidMount() {
    this.apiCall()
  }

  apiCall = async () => {
    try {
      const res = await fetch(
        'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
      )
      const data = await res.json()
      if (data.length > 0 && data[0].table_menu_list.length > 0) {
        const initialCategory = data[0].table_menu_list[0].menu_category
        this.setState({data, displayCat: initialCategory})
      }
    } catch (e) {
      console.error('Error fetching data:', e) // Use console.error for errors
    }
  }

  changeCat = category => {
    this.setState({displayCat: category})
  }

  increaseQuantity = id => {
    const {quantityList} = this.state
    const updatedList = [...quantityList]
    const index = updatedList.findIndex(item => item.id === id)

    if (index === -1) {
      updatedList.push({id, quantity: 1})
    } else {
      updatedList[index].quantity += 1
    }
    this.setState(prev => ({
      quantityList: [...updatedList],
      cartQuantity: prev.cartQuantity + 1,
    }))
  }

  decreaseQuantity = id => {
    const {quantityList, cartQuantity} = this.state
    const updatedList = [...quantityList]
    const index = updatedList.findIndex(item => item.id === id)
    if (index !== -1 && updatedList[index].quantity > 0) {
      updatedList[index].quantity -= 1

      if (updatedList[index].quantity === 0) {
        updatedList.splice(index, 1)
      }
      let x = cartQuantity - 1
      if (x < 0) x = 0
      this.setState({
        quantityList: [...updatedList],
        cartQuantity: x,
      })
    }
  }

  render() {
    const {displayCat, data, cartQuantity, quantityList} = this.state

    let displayItems = []
    if (data.length > 0) {
      const menuItems = data[0].table_menu_list
      const currentCategory = menuItems.find(
        item => item.menu_category === displayCat,
      )
      if (currentCategory) {
        displayItems = currentCategory.category_dishes
      }
    }

    return (
      <div className="app-container">
        <header className="header">
          <h1 className="restaurant-name">UNI Resto Cafe</h1>
          <div className="cart-summary">
            <p className="my-orders-text">My Orders</p>
            <p className="cart-quantity">{cartQuantity}</p>
          </div>
        </header>
        <hr className="header-divider" />
        <nav className="menu-categories-nav">
          {data.length > 0 &&
            data[0].table_menu_list.map(each => (
              <button
                key={each.menu_category_id}
                type="button"
                className={`category-button ${
                  displayCat === each.menu_category ? 'active' : ''
                }`}
                onClick={() => this.changeCat(each.menu_category)}
              >
                {each.menu_category}
              </button>
            ))}
        </nav>
        <hr className="category-divider" />
        <div className="dish-list-container">
          {displayItems.map(item => {
            const elementQuantity = quantityList.find(
              i => i.id === item.dish_id,
            )
            const quantity = elementQuantity ? elementQuantity.quantity : 0 

            const dishDetails = {
              id: item.dish_id,
              dishName: item.dish_name,
              dishCurrency: item.dish_currency,
              dishDescription: item.dish_description,
              dishCalories: item.dish_calories,
              dishImage: item.dish_image,
              quantity,
              dishPrice: item.dish_price,
              dishAvailability: item.dish_Availability,
              addonCat: item.addonCat,
            }
            return (
              <DisplayList
                onincreaseQuantity={this.increaseQuantity}
                ondecreaseQuantity={this.decreaseQuantity}
                key={dishDetails.id}
                details={dishDetails}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default App
