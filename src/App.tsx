import React, {AnimationEvent, MouseEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import {Horizontal, Vertical} from "react-hook-components";
import {data, Product} from "./data";
import invariant from "tiny-invariant";
import {IoClose} from "react-icons/io5";
import {HorizontalProductList} from "./HorizontalProductList";

export const imageSize = {width:110,height:150};






function App() {

    const detailContainerRef = useRef<HTMLDivElement>(null);

    const [globalSearch, setGlobalSearch] = useState('');
    const dp = data.filter(d => JSON.stringify(d).toLowerCase().indexOf(globalSearch) >= 0);
    const category = Array.from(new Set(dp.map(d => d.category)));



    return <Vertical>
        <Vertical pL={10} pR={10} pT={10} hAlign={'left'} >
            <Vertical style={{fontSize: '2rem', textAlign: 'center', flexGrow: 1}}>
                Farm To Table
            </Vertical>
            <Vertical mT={10}>
                Farm to table is a concept that involves delivering dairy farm products like milk or cheese to your
                home. If you order our products before 8 p.m., we will ensure that you receive them the following
                morning. Our trucks will depart from our farm at 4 a.m. and arrive at your location between 7 and 10
                a.m.
            </Vertical>
            <input placeholder={'Search here'} onChange={(e) => setGlobalSearch(e.target.value)}
                   className={'input'} style={{marginTop:'1rem'}}
            />
        </Vertical>
        {category.map(category => {
            return <Vertical key={category} mL={10} mT={10} mR={10}>
                <Vertical style={{fontSize: '1.5rem'}}>
                    {category}
                </Vertical>
                <HorizontalProductList dp={dp}
                                       category={category} />

            </Vertical>
        })}
        <Vertical className={'detail-container'}
                  style={{position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: -1}}/>
        <style className={'dynamic-style'}/>
    </Vertical>;
}

export default App;
