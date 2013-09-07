# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)
$ext_path = File.join('..', '..', '..', 'ext')

# Load the extjs framework automatically.
load File.join($ext_path, 'resources', 'themes')

# Compass configurations
relative_assets=true
sass_path = dir
css_path = File.join(File.dirname(__FILE__), "..", "..", "css", "default")
images_dir = File.join("..", "..", "images", "default")
#output_style = :compressed
output_style = :expanded
environment = :production
