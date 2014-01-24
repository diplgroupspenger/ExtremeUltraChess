function Room(title, description, owner){
	this.title=title;
	this.description=description;
	this.owner=owner;
	this.people=[];
	this.status="available";
}

Room.prototype.addPerson=function(personID, color){
	if(this.status=="available"){
		this.people.push({'id':personID, 'color':color});
	}
};

if(typeof module !== 'undefined' && module.exports) {
	module.exports=Room;
}