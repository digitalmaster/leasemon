window.App = {
    Models: {},
    Views: {}
};

App.Models.leaseInfo = Backbone.Model.extend({
    defaults : {
        date         : '11/2/2012',
        current      : 12244,
        years        : 3,
        milesAllowed : 15000,
        overagesCost : 0.25
        // date         : 0,
        // current      : 0,
        // years        : 0,
        // milesAllowed : 0,
        // overagesCost : 0
    },

    validate: function(attrs){
        var errors = this.errors = {};
        if(attrs.date != null){
            if(!attrs.date) return 'Date is not the right format';
        }
        
        if(attrs.current != null){
            if(!attrs.current || attrs.current < 0) return 'Current mileage must be number greater than 0';
        }

        if(attrs.years != null){
            if(!attrs.years || attrs.years < 1) return'Years must be a number';
        }

        if(attrs.overagesCost != null ){
            if(isNaN(attrs.overagesCost) || attrs.overagesCost < 0) return 'Cost must be a number.';
        }

    }
});

App.Views.infoPane = Backbone.View.extend({
    initialize : function(){
        this.render();
        this.model.on('change', this.render, this)
    },

    render: function(){
        console.log("Rendering...");
        var data     = this.calc( this.model.toJSON() );
        var template = _.template( $('#info_pane').html(), data );
        this.$el.html( template );
    },

    calc: function(data){
        var info        = {},
            daysInAYear = 365.242;

        // Information    
        info.totalMiles = data.years * data.milesAllowed;
        info.totalDays  = data.years * daysInAYear;
        info.daysPassed = Math.round( ( Date.now() - Date.parse(data.date) ) / 86400 / 1000 );
        info.daysLeft   = Math.round( info.totalDays - info.daysPassed );
        info.perDay     = data.milesAllowed / daysInAYear;
        info.shouldBe   = Math.round( info.daysPassed * info.perDay );
        info.difference = data.current - info.shouldBe;
        info.willCost   = data.overagesCost * info.difference
        info.milesLeft  = info.totalMiles - data.current;
        info.shouldDrive = info.milesLeft / info.daysLeft;
        info.leftInYear = Math.ceil( info.daysPassed / daysInAYear ) * data.milesAllowed - data.current; 

        // Format numbers / Validate stuff
        info.overUnder  = info.difference > 0 ? 'over' : 'under';
        info.difference = Math.abs(info.difference);
        info.willCost   = info.willCost <= 0 ? 0 : info.willCost;
        info.willCost   = Math.round(info.willCost * 100) / 100;
        info.perDay     = Math.round(info.perDay * 100) / 100;
        info.leftInYear = info.leftInYear <= 0 ? 0 : info.leftInYear;
        info.daysLeft   = info.daysLeft <= 0 ? 0 : info.daysLeft;
        info.shouldDrive = Math.round( info.shouldDrive );   
        return info;
    }
});

App.attachEvents = function(){
    $('form#leaseInfo').on('change', 'select', function(e){
        App.Models.leaseInfoModel.set( e.currentTarget.name, parseInt(e.currentTarget.value), {validate: true, validateAll: false} );
    });

    $('form#leaseInfo').on('keyup', 'input', function(e){
        App.Models.leaseInfoModel.set( e.currentTarget.name, parseFloat(e.currentTarget.value), {validate: true, validateAll: false}  );
    });

    //Date Picker
    var dateInput = $('input#date')[0];
    new Pikaday({
        field: dateInput,
        maxDate: new Date(),
        onSelect : function(){
            App.Models.leaseInfoModel.set( 'date', this.getDate(), {validate: true, validateAll: false} )
            $(dateInput).val( this.getMoment().format('MMMM Do YYYY') );
        }
    });
};

App.init = function () {

    App.attachEvents();
    App.Models.leaseInfoModel = new App.Models.leaseInfo();
    App.Views.mainInfoPaneView = new App.Views.infoPane({ model: App.Models.leaseInfoModel });

    //Listen for Validation errors
    App.Models.leaseInfoModel.on('invalid', function(model, error){
        console.log('Invalid: ' + error);
    });

    //Append to DOM
    $('#info_pane').before(App.Views.mainInfoPaneView.el);

};

App.init();
