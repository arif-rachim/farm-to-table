import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Horizontal, Vertical} from "react-hook-components";
import {data} from "./data";
import {HorizontalProductList} from "./HorizontalProductList";
import {IoCartOutline} from "react-icons/io5";
import {lightGreen} from "./colorCombo";
import {db, LineItem} from "./db";
import {ObserverValue, useObserver} from "react-hook-useobserver";
import {Button} from "antd-mobile";
import invariant from "tiny-invariant";
import {IoRemoveCircleOutline} from "react-icons/io5";
function App() {

    const [globalSearch, setGlobalSearch] = useState('');
    const dp = data.filter(d => JSON.stringify(d).toLowerCase().indexOf(globalSearch.toLowerCase()) >= 0);
    const category = Array.from(new Set(dp.map(d => d.category)));
    const [$total, setTotal] = useObserver(0);
    const [$lineItems, setLineItems] = useObserver<LineItem[]>([]);
    const bottomNavBar = useRef<HTMLDivElement>(null);
    useEffect(() => {
        (async () => {
            const lineItems = await db.items.toArray();
            setLineItems(lineItems);
            const total = lineItems.reduce((output: any, item: LineItem) => {
                return output + item.total;
            }, 0);
            setTotal(total);
        })();
    }, []);
    const onValueChange = async () => {
        const lineItems = await db.items.toArray();
        const total = lineItems.reduce((output: any, item: LineItem) => {
            return output + item.total;
        }, 0);
        setTotal(total);
        setLineItems(lineItems);
    }
    return <Vertical h={'100%'} overflow={'auto'}>
        <Vertical hAlign={'left'}
                  style={{position: 'fixed', width: '100%', background: 'linear-gradient(white,rgba(255,255,255,0.5)) ', zIndex: 1,}}
                  className={'blur-background'}
        onClick={() => {
            invariant(bottomNavBar.current);
            bottomNavBar.current.classList.remove('open');
        }}>
            <Vertical style={{
                fontSize: '2.5rem',
                marginBottom: -15,
                marginTop: 15,
                textAlign: 'center',
                flexGrow: 1,
                paddingLeft: 10,
                paddingRight: 10
            }}>
                Farm To Table
            </Vertical>
            <input placeholder={'Search here'} onChange={(e) => setGlobalSearch(e.target.value)}
                   className={'search'} style={{marginBottom:0,marginTop: '1rem'}}
            />
        </Vertical>
        <Vertical h={'100%'} overflow={'auto'} pB={50}>
            <Vertical mT={100} pL={10} pR={10}>
                Farm to table is a concept that involves delivering dairy farm products like milk or cheese to your
                home. If you order our products before 8 p.m., we will ensure that you receive them the following
                morning. Our trucks will depart from our farm at 4 a.m. and arrive at your location between 7 and 10
                a.m.
            </Vertical>
            {category.map(category => {
                return <Vertical key={category} mT={10}>
                    <Vertical style={{fontSize: '1.5rem', marginLeft: 10}}>
                        {category}
                    </Vertical>
                    <HorizontalProductList dp={dp}
                                           category={category} onValueChange={onValueChange}/>

                </Vertical>
            })}

        </Vertical>

        <Vertical ref={bottomNavBar} className={'blur-background bottom-navbar'} style={{
            borderTop: '1px solid rgba(0,0,0,0.08)',
            position: 'fixed',
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.8)'
        }}>
            <Horizontal  m={10} hAlign={'center'}>
                <Vertical position={'relative'} onClick={() => {
                    invariant(bottomNavBar.current);
                    bottomNavBar.current.classList.add('open');
                }}>
                    <IoCartOutline style={{fontSize: '2rem', color: 'rgba(0,0,0,0.8)'}}/>
                    <ObserverValue observers={$total} render={() => {
                        return <Vertical style={{
                            position: 'absolute',
                            top: 0,
                            right: -5,
                            backgroundColor: lightGreen,
                            borderRadius: '1rem',
                            padding: 2,
                            fontSize: '0.6rem'
                        }}>
                            {$total.current}
                        </Vertical>
                    }}/>
                </Vertical>
            </Horizontal>
            <Vertical h={'100%'} overflow={'auto'}>
            <ObserverValue observers={$lineItems} render={() => {
                const lineItems = $lineItems.current;
                return <Vertical w={'100%'} pB={10}>
                    {lineItems.map(lineItem => {
                        return <Horizontal w={'100%'} style={{fontSize: '1rem'}} p={10} pT={5} pB={10}>
                            <Vertical>
                                {lineItem.product.name}
                            </Vertical>

                            <Vertical style={{flexGrow: 1}}/>
                            <Vertical mR={5}>
                                {lineItem.total}
                            </Vertical>
                            x
                            <Vertical w={50} h={'right'} mL={5} hAlign={'right'}>
                                {lineItem.product.price}
                            </Vertical>
                            <Vertical mL={10} onClick={async () => {
                                invariant(lineItem.id);
                                await db.items.delete(lineItem.id);
                                await onValueChange()
                            }}>
                                <IoRemoveCircleOutline style={{fontSize:'1.2rem'}}/>
                            </Vertical>
                        </Horizontal>
                    })}
                </Vertical>
            }}/>
            </Vertical>
            <Horizontal style={{margin:10}}>
                <Button color={"primary"} style={{flexGrow:1}}> Check out</Button>
                <Button style={{marginLeft:10}} onClick={() => {
                    invariant(bottomNavBar.current)
                    bottomNavBar.current.classList.remove('open')
                }}> Cancel</Button>
            </Horizontal>
        </Vertical>


        <Vertical className={'detail-container'}
                  style={{position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: -1}}/>
        <style className={'dynamic-style'}/>
    </Vertical>;
}

export default App;
