import { CartContext } from "@/contexts/CartContext";
import styles from "@/styles/component.module.css";
import { CartItem, Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "react-bootstrap";

interface Props {
  actualVariant?: Product;
  inCart?: boolean;
  setInCart?: Dispatch<SetStateAction<boolean>>;
  page: string;
  item?: CartItem;
}

export default function Counter({ actualVariant, page, item }: Props) {
  const { cart, AddToCartContext, ModifyOrderContext, calculateTotal } =
    useContext(CartContext);

  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [spin, setSpin] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [counter, setCounter] = useState<number>(1);
  const [inCart, setInCart] = useState<boolean>(false);

  const AddToCart = () => {
    if (actualVariant && setInCart) {
      setShowAdd(true);
      setTimeout(() => setShowAdd(false), 1000);
      setSpin(true);
      AddToCartContext(actualVariant, counter);
      setInCart(true);
    }
  };

  const ModifyOrder = () => {
    if (actualVariant && counter === 0 && setInCart) {
      ModifyOrderContext(actualVariant, counter);
      setInCart(false);
      setCounter(1);
    } else if (actualVariant) {
      ModifyOrderContext(actualVariant, counter);
    }
  };

  const increase = () => {
    setCounter((count: number) => count + 1);
    if (page === "cart" && item) {
      cart.filter(
        (cartItem) => cartItem.item.internal_id === item.item.internal_id
      )[0].number = counter + 1;
      calculateTotal(cart);
    } else if (actualVariant && setInCart) {
      setShowRemove(false);
      setShowAdd(true);
      setSpin(true);
      setTimeout(() => setShowAdd(false), 1000);
      if (inCart) {
        ModifyOrderContext(actualVariant, counter + 1);
      } else {
        AddToCartContext(actualVariant, counter + 1);
        setInCart(true);
      }
    }
  };

  const decrease = () => {
    setCounter((count: number) => count - 1);
    if (item) {
      cart.filter(
        (cartItem) => cartItem.item.internal_id === item.item.internal_id
      )[0].number = counter - 1;
      calculateTotal(cart);
    } else if (actualVariant && setInCart) {
      setShowAdd(false);
      setShowRemove(true);
      setReverse(true);
      setTimeout(() => setShowRemove(false), 1000);
      if (counter - 1 === 0) {
        ModifyOrderContext(actualVariant, counter - 1);
        setInCart(false);
      } else {
        AddToCartContext(actualVariant, counter - 1);
      }
    }
  };

  // const increase = () => {
  //   if (page === "product") {
  //     setCounter((count: number) => count + 1);
  //   } else if (page === "cart" && item) {
  //     setCounter((count: number) => count + 1);
  //     cart.filter(
  //       (cartItem) => cartItem.item.internal_id === item.item.internal_id
  //     )[0].number = counter + 1;
  //     calculateTotal(cart);
  //   }
  // };

  // const decrease = () => {
  //   if (page === "product") {
  //     if (inCart && counter > 0) {
  //       setCounter((count: number) => count - 1);
  //     } else if (!inCart && counter > 1) {
  //       setCounter((count: number) => count - 1);
  //     }
  //   } else if (page === "cart" && item) {
  //     setCounter((count: number) => count - 1);
  //     cart.filter(
  //       (cartItem) => cartItem.item.internal_id === item.item.internal_id
  //     )[0].number = counter - 1;
  //     calculateTotal(cart);
  //   }
  // };

  useEffect(() => {
    if (actualVariant) {
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].item.internal_id === actualVariant.internal_id) {
          setCounter(cart[i].number);
          setInCart(true);
          break;
        } else {
          setCounter(1);
          setInCart(false);
        }
      }
    }
  }, [actualVariant]);

  useEffect(() => {
    if (item) {
      setCounter(item.number);
    }
  }, [item]);

  return (
    <>
      {page === "product" && (
        <div
          style={{ position: "absolute", bottom: "15px" }}
          className={styles.counter}
        >
          {inCart ? (
            <div>
              <Button
                variant="primary"
                className={styles.product_button}
                onClick={decrease}
              >
                -
              </Button>
              <span className={styles.counter_output}>{counter}</span>
              <Button
                variant="primary"
                className={styles.product_button}
                onClick={increase}
              >
                +
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="primary"
                className={styles.product_button}
                onClick={AddToCart}
              >
                Add to Cart
              </Button>
            </div>
          )}
          {inCart && (
            <Link href={`/cart`}>
              <div
                className={reverse ? `${styles.counter_icon_reverse}` : ""}
                onAnimationEnd={() => {
                  setReverse(false);
                }}
              >
                <Image
                  alt={`shopping cart`}
                  title={`Go to the shopping cart`}
                  src={`/Images/Icons/shopping-cart.png`}
                  width={25}
                  height={25}
                  className={spin ? `${styles.counter_icon}` : ""}
                  onAnimationEnd={() => {
                    setSpin(false);
                  }}
                />
              </div>
            </Link>
          )}
          {showAdd && <p className={styles.counter_message}>Added to cart!</p>}
          {showRemove && (
            <p className={styles.counter_message}>Removed from cart!</p>
          )}
        </div>
      )}
      {page === "cart" && (
        <div
          style={{ position: "relative", bottom: "0px" }}
          className={styles.counter}
        >
          <Button
            variant="primary"
            className={styles.product_button}
            onClick={decrease}
          >
            -
          </Button>
          <span className={styles.counter_output}>{counter}</span>
          <Button
            variant="primary"
            className={styles.product_button}
            onClick={increase}
          >
            +
          </Button>
        </div>
      )}
    </>
  );
}
