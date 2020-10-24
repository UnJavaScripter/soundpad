class PadButton extends HTMLButtonElement {
  padButtonId: string;
  pressed: boolean = false;
  constructor() {
    super();

    const u32Arr = new Uint32Array(1);
    const randomId = window.crypto.getRandomValues(u32Arr)[0];
    const label = this.getAttribute('pad-label');

    this.padButtonId = 'pad-button-' + randomId;
    this.setAttribute('id', this.padButtonId);
    
    this.addEventListener('pointerover', e => this.hoverState() );
    this.addEventListener('focus', e => this.hoverState() );
    this.addEventListener('blur', e => this.blurState() );

    this.addEventListener('pointerdown', e => {
      this.buttonPressed();
    });

    this.addEventListener('pointerleave', e => this.blurState() );
    this.addEventListener('blur', e => this.blurState() );

    this.innerHTML = `<div class="container"><p style="margin: 0 0 0.5rem 0">${this.innerText || '🔊'}</p><p style="font-size: 1ch; margin: 0">${label}</p></div>`;
    this.setGeneralStyles();

    this.addEventListener<any>('reproductionend', (event: CustomEvent) => {
      console.log('ended')
      console.log(event)
      this.soundEnded();
    });
  }

  setGeneralStyles() {
    this.style.padding = '3.5rem';
    this.style.fontSize = '5rem';
    this.style.cursor = "pointer";
    this.style.margin = "0 8px";
    this.style.borderColor = "#f2f2f2";
    this.style.borderWidth = "1px";
    this.style.borderRadius = "0.9rem";
    this.style.transition = "box-shadow 0.3s ease, transform 0.15s ease";
    this.style.width = '17rem'
    this.style.marginTop = '1.5rem'

    this.setInitialStatusStyles();
  }

  setInitialStatusStyles() {
    if(this.pressed) {
      return;
    }

    this.style.color = "#555";
    this.style.textShadow = "0 0.5px 1px #777, 0 2px 6px #f2f2f2";
    this.style.background = "-webkit-linear-gradient(top, #f9f9f9 0%, #D2D2D2 80%, #c0c0c0 100%)";
    this.style.boxShadow = "0 0 1px #888, 0 1px 0 #fff, 0 6px 0 #C0C0C0, 0 8px 17px rgba(#444, 0.4), 2px 1px 4px rgba(#444, 0.25), -2px 1px 4px rgba(#444, 0.25), 0 9px 16px rgba(#444, 0.1)";
    this.style.transform = "translateY(0)";
  }

  hoverState() {
    this.style.textShadow = "3px 2px 3px #95d4ae, 4px 3px 7px #fff";
    this.style.boxShadow = "0 0 1px #888,0 1px 0 #fff, 0 4px 0 #C0C0C0, 0 2px 35px rgba(#444, 0.3), 2px 2px 4px rgba(#444, 0.25), -2px 2px 4px rgba(#444, 0.25), 0 7px 4px rgba(#444, 0.1)";
    this.style.transform = "translateY(0.1rem)";
  }

  blurState() {
    this.setInitialStatusStyles();
  }

  buttonPressed() {
    this.pressed = true;
    this.style.boxShadow = "0 0 1px #888,0 1px 0 #fff, 0 0 0 #C0C0C0, 0 0px 30px rgba(#444, 0.15), 2px 2px 4px rgba(#444, 0.25), -2px 2px 4px rgba(#444, 0.25), 0 0px 4px rgba(#444, 0.25)";
    this.style.transform = "translateY(0.3rem)";
    this.style.background = "-webkit-linear-gradient(top, #c9fff9 0%, #D2F2D2 80%, #f9fff9 100%)";

    this.dispatchEvent(new CustomEvent('padbuttonpress', {
      detail: {
        sound: this.getAttribute('sound-src'),
        id: this.padButtonId
      },
      bubbles: true
    }));
  }

  soundEnded() {
    this.pressed = false;
    this.setInitialStatusStyles();
  }

}

customElements.define('pad-button', PadButton, {extends: 'button'});