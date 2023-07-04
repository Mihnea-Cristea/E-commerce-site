import React from "react";
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

export default function CarouselHomepage() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval={2000}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://live.staticflickr.com/65535/52969619769_24b246e149_o.jpg"
          alt="First slide"
          height={400}
        />
        <Carousel.Caption>
          <h3>Despre noi</h3>
          <p>De 15 ani de când suntem pe piața românească avem o permanentă preocupare pentru sănătatea clienților noștri, fapt ce ne-a determinat 
             să facem o selecție riguroasă a rețetelor folosite și a oamenilor cu care lucrăm, respectând în același timp și normele europene în domeniul alimentației.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://live.staticflickr.com/65535/52969480681_47d0d71af8_o.jpg"
          alt="Second slide"
          height={400}
        />

        <Carousel.Caption>
          <h3>Cofetărie</h3>
          <p>Delicii fine și rafinate, produse de cofetărie proaspăt preparate, cu arome și texturi îmbietoare, perfecte pentru a răsfăța simțurile și a bucura papilele gustative.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://live.staticflickr.com/65535/52969980848_e5ab8a5196_o.png"
          alt="Third slide"
          height={400}
        />

        <Carousel.Caption>
          <h3>Patiserie</h3>
          <p>
            Delicatese de patiserie, realizate cu măiestrie și pasiune, ce îmbină arome îmbietoare și texturi fragede, oferind o experiență dulce de neuitat pentru iubitorii de deserturi.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
