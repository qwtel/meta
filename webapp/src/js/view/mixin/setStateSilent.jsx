define(function () {
  var SetStateSilent = {
    getInitialState: function () {
      return {
        entered: false
      }
    },
    
    componentDidMount: function() {
      setTimeout(function () {
        if (this.refs.page && this.refs.page.getDOMNode()) {
          this.refs.page.getDOMNode().dispatchEvent(new Event('animationend'));
        }
        
        this.setState({
          entered: true
        });
        
      }.bind(this), 500);
    },
    
    setStateSilent: function(state) {
      if (!this.state.entered) {
        Object.keys(state).forEach(function (k) {
          this.state[k] = state[k];
        }, this);
      } else {
        this.setState(state);
      }
    }
  };
  
  return SetStateSilent;
});
