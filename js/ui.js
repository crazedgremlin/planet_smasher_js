$(function() {

	function getFuncSetCameraMode( mode ) {
		return function() {
			var but = $(this);
			
			$(".cameraButton").removeClass("btn-primary").addClass("btn-default");
			$(this).removeClass("btn-default").addClass("btn-primary");

			cameraMode = mode;
		}
	}

	$("button#camera_follow_btn").on('click', getFuncSetCameraMode(CAMERA_MODES.FOLLOW));
	$("button#camera_watch_center_btn").on('click', getFuncSetCameraMode(CAMERA_MODES.WATCH_CENTER));
	$("button#camera_watch_from_center_btn").on('click', getFuncSetCameraMode(CAMERA_MODES.WATCH_FROM_CENTER));
});