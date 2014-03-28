/*global defineSuite*/
defineSuite([
         'Widgets/SceneModePicker/SceneModePickerViewModel',
         'Core/Event',
         'Core/Ellipsoid',
         'Scene/CentralBody',
         'Specs/createScene',
         'Specs/destroyScene',
         'Scene/SceneMode'
     ], function(
         SceneModePickerViewModel,
         Event,
         Ellipsoid,
         CentralBody,
         createScene,
         destroyScene,
         SceneMode) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/
    var scene;
    var ellipsoid = Ellipsoid.WGS84;
    beforeEach(function() {
        scene = createScene();
        var centralBody = new CentralBody(ellipsoid);
        scene.primitives.centralBody = centralBody;
    });

    afterEach(function() {
        destroyScene(scene);
    });

    it('Can construct and destroy', function() {
        var viewModel = new SceneModePickerViewModel(scene);
        expect(viewModel.scene).toBe(scene);
        expect(scene._transitioner.morphStart.numberOfListeners).toEqual(1);
        expect(viewModel.isDestroyed()).toEqual(false);
        viewModel.destroy();
        expect(viewModel.isDestroyed()).toEqual(true);
        expect(scene._transitioner.morphStart.numberOfListeners).toEqual(0);
    });

    it('dropDownVisible and toggleDropDown work', function() {
        var viewModel = new SceneModePickerViewModel(scene);

        expect(viewModel.dropDownVisible).toEqual(false);
        viewModel.toggleDropDown();
        expect(viewModel.dropDownVisible).toEqual(true);
        viewModel.dropDownVisible = false;
        expect(viewModel.dropDownVisible).toEqual(false);

        viewModel.destroy();
    });

    it('morphing closes the dropDown', function() {
        var viewModel = new SceneModePickerViewModel(scene);

        viewModel.dropDownVisible = true;
        viewModel.morphTo2D();
        expect(viewModel.dropDownVisible).toEqual(false);

        viewModel.dropDownVisible = true;
        viewModel.morphTo3D();
        expect(viewModel.dropDownVisible).toEqual(false);

        viewModel.dropDownVisible = true;
        viewModel.morphToColumbusView();
        expect(viewModel.dropDownVisible).toEqual(false);

        viewModel.destroy();
    });

    it('morphing calls correct transition', function() {
        var viewModel = new SceneModePickerViewModel(scene);

        expect(scene.mode).toEqual(SceneMode.SCENE3D);

        viewModel.morphTo2D();
        scene.completeMorph();
        expect(scene.mode).toEqual(SceneMode.SCENE2D);

        viewModel.morphTo3D();
        scene.completeMorph();
        expect(scene.mode).toEqual(SceneMode.SCENE3D);

        viewModel.morphToColumbusView();
        scene.completeMorph();
        expect(scene.mode).toEqual(SceneMode.COLUMBUS_VIEW);

        viewModel.destroy();
    });

    it('selectedTooltip changes on transition', function() {
        var viewModel = new SceneModePickerViewModel(scene);

        viewModel.morphTo2D();
        expect(viewModel.selectedTooltip).toEqual(viewModel.tooltip2D);

        viewModel.morphTo3D();
        expect(viewModel.selectedTooltip).toEqual(viewModel.tooltip3D);

        viewModel.morphToColumbusView();
        expect(viewModel.selectedTooltip).toEqual(viewModel.tooltipColumbusView);

        viewModel.destroy();
    });

    it('create throws with undefined scene', function() {
        expect(function() {
            return new SceneModePickerViewModel();
        }).toThrowDeveloperError();
    });

});