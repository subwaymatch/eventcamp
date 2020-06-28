<?php 
	$randomNumber1 = rand(1, 12);
	$randomNumber2 = rand(1, 12);

	$contactCaptchaAnswer = $randomNumber1 + $randomNumber2;
?>
				<div id="contact-warning">
				</div><!-- // #contact-warning -->
				
				<div id="contact-success">
					Email successfuly sent, thank you.<br />	
				</div><!-- // #contact-warning -->
				
				<form name="contactForm" id="contactForm" method="post" action="includes/include.emailSender.php">
					<fieldset>
					
						<label for="contactName">Name <span class="required">*</span></label>
						<input name="contactName" type="text" id="contactName" size="30" value="" />
						
						<br />
						<label for="contactEmail">Email <span class="required">*</span></label>
						<input name="contactEmail" type="text" id="contactEmail" size="30" value="" />
                        
                        <br />
						<label for="contactMessage">Message <span class="required">*</span></label>
						<textarea name="contactMessage" id="contactMessage" rows="6" cols="7"></textarea>
                        
                        <br />
						<label for="contactCaptcha"><strong><?php echo $randomNumber1; ?></strong> + <strong><?php echo $randomNumber2; ?></strong> = <span class="required">*</span></label>
						<input name="contactCaptcha" type="text" id="contactCaptcha" size="30" value="" />

						<input name="contactCaptchaAnswer" type="hidden" id="contactCaptchaAnswer" value="<?php echo $contactCaptchaAnswer ?>" />

						<br />
						<label class="placeholder">&nbsp;</label>
						<button class="submit">Submit</button>
					</fieldset>
				</form>