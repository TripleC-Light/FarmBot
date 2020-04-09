class Monster{
	constructor( id ){
		this.id = id;
		this.HP_id = '';
		this.List = [ '綠毛蟲', '鐵甲蛹', '巴大蝶'];
		this.HPList = [ 10, 20, 30];
		this.HP = this.HPList[0];
		this.LV = 0;
		this.name = this.List[this.LV];
		this.X = 0;
		this.Y = 0;
		this.pic = "./static/Caterpillar.png";
	}

	show(){
		document.getElementById(this.id).style.visibility = 'visible';
	}
	hide(){
		document.getElementById(this.id).style.visibility = 'hidden';
	}

	showHP(){
		var _HPlengthInPx = 70;
		var _HPobj = document.getElementById(this.HP_id);
		var _damage = Math.round(_HPlengthInPx/this.HPList[this.LV]);
		this.setHPPosition(0, -3);
		_HPobj.style.width = (this.HP*_damage) + 'px';
		_HPobj.style.display = 'inline';
	}
	hideHP(){
		document.getElementById(this.HP_id).style.display = 'none';
	}
	autoSetHPcolor(){
		var _HPobj = document.getElementById(this.HP_id);
		if( this.HP<=10 ){
			_HPobj.style.backgroundColor = '#F00';
		}else if( this.HP<=20 ){
			_HPobj.style.backgroundColor = '#FF8040';
		}else if( this.HP<=30 ){
			_HPobj.style.backgroundColor = '#0FF';
		}
	}

	setHPPosition( offsetX, offsetY){
		var _HPobj = document.getElementById(this.HP_id);
		_HPobj.style.top = (this.Y+offsetY) + '%';
		_HPobj.style.left = (this.X+offsetX) + '%';
	}

	setPosition( X, Y){
		var _monsterObj = document.getElementById(this.id);
		this.X = X;
		this.Y = Y;
		_monsterObj.style.left = this.X + '%';
		_monsterObj.style.top = this.Y + '%';
	}

	setPositionInPX( X, Y){
		var _monsterObj = document.getElementById(this.id);
		this.X = X;
		this.Y = Y;
		_monsterObj.style.left = this.X + 'px';
		_monsterObj.style.top = this.Y + 'px';
	}

	setPositionRandom(){
		var _X = Math.floor(Math.random()*90);
		var _Y = Math.floor(Math.random()*90);
		this.setPosition( _X, _Y)
		if( this.HP_id!='' ){
			this.setHPPosition(0, -3);
		}
		
	}

	shake(shakeLevel){
		var _monsterObj = document.getElementById(this.id);
		var _X = this.X;
		_X += shakeLevel;
		_monsterObj.style.left = _X + '%';
		setTimeout(function(){
			_X -= shakeLevel;
			_monsterObj.style.left = _X + '%';
		},30);
	}

	hit( ATK ){
		var _this = this;
		this.HP -= ATK;
		if( this.HP<=0 ){
			this.LV += 1;
			this.hide();
			if( this.LV>2 ){
				this.LV = 0;
			}
		}
		this.autoSetHPcolor()
		this.shake(2);
		this.showHP();
		setTimeout(function(){
			_this.setPositionRandom();
		},100);
		setTimeout(function(){
			_this.hideHP();
		},500);
	}

	reBorn(){
		var _monsterObj = document.getElementById(this.id);
		var _size = ['', ''];
		this.HP = this.HPList[this.LV];
		switch( this.LV ){
			case 0:
				this.name = this.List[this.LV];
				_monsterObj.style.backgroundImage = "url(" + this.pic + ")";
				_size = ['40px', '40px'];
				break;
			case 1:
				this.name = this.List[this.LV];
				_monsterObj.style.backgroundImage = "url(./static/Caterpillar_LV2.png)";
				_size = ['70px', '70px'];
				break;
			case 2:
				this.name = this.List[this.LV];
				_monsterObj.style.backgroundImage = "url(./static/Caterpillar_LV3.png)";
				_size = ['100px', '100px'];
				break;
			default:
				break;
		}
		_monsterObj.style.width = _size[0];
		_monsterObj.style.height = _size[1];
		this.setPositionRandom();
		this.show();
	}

	setPic(pic){
		this.pic = pic;
		var _monsterObj = document.getElementById(this.id);
		_monsterObj.style.backgroundImage = "url(" + pic + ")";
	}

	goto( P2){
		var _P1 = [ this.X, this.Y ];
		var _dX = _P1[0] - P2[0];
		var _dY = _P1[1] - P2[1];

		// console.log('_dX= ' + _dX);
		// console.log('_dY= ' + _dY);
		// console.log('this.X= ' + this.X);
		// console.log('this.Y= ' + this.Y);
		if( distance( _P1, P2)<1 ){
			return true;
		}else{
			var _step = 10;
			var _d = Math.round(distance( _P1, P2));
			var _howManyTimesToGo = Math.round(_d / _step);
			this.X = this.X - ( _dX / _howManyTimesToGo );
			this.Y = this.Y - ( _dY / _howManyTimesToGo );
			this.setPositionInPX( this.X, this.Y);

			// console.log('_d= ' + _d);
			// console.log('_howManyTimesToGo= ' + _howManyTimesToGo);
			// console.log('this.X= ' + this.X);
			// console.log('this.Y= ' + this.Y);
			return false;
		}
	}
}

function distance( P1, P2){
	var _dX = P1[0] - P2[0];
	var _dY = P1[1] - P2[1];
	return Math.sqrt( _dX*_dX + _dY*_dY );
}