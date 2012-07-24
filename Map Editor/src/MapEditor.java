import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

@SuppressWarnings("serial")
public class MapEditor extends JFrame {
	
	private static MapEditor mapEditor;
	
	private final int ROWS = 24;
	private final int COLUMNS = 24;
	private final int TILESIZE = 16;
	
	private JButton load, save, clear;
	private MapTile mapTiles1[][] = new MapTile[ROWS][COLUMNS];
	private MapTile mapTiles2[][] = new MapTile[ROWS][COLUMNS];
	private MapTile black, blue, brown, ccw_cyan, cw_cyan, gray, green, lightgreen,
			lightred, orange, pink, puke, purple, red, down_yellow, up_yellow, 
			right_yellow, left_yellow, white;
	private Dimension dimension = new Dimension(ROWS*TILESIZE, COLUMNS*TILESIZE);
	private Dimension paletteDimesion = new Dimension(150, 300);

	public final int BACKGROUND = 0;
	public final int BOX = 1;
	public final int BALL_GATE = 2;
	public final int CCWBOUNCY_BOX = 3;
	public final int CWBOUNCY_BOX = 4;
	public final int TELEPORTER = 5;
	public final int PLAYER_2 = 6;
	public final int PLAYER_BUTTON = 7;
	public final int BOX_BUTTON = 8;
	public final int GOAL = 9;
	public final int PLAYER_GATE = 10;
	public final int BALL_BUTTON = 11;
	public final int BALL = 12;
	public final int PLAYER_1 = 13;
	public final int DOWN_MOVING_BOX = 14;
	public final int UP_MOVING_BOX = 15;
	public final int RIGHT_MOVING_BOX = 16;
	public final int LEFT_MOVING_BOX = 17;
	public final int PORTAL = 18;

	public ImageIcon blackTile = new ImageIcon(getClass().getResource("/black.png"));
	public ImageIcon blueTile = new ImageIcon(getClass().getResource("/blue.png"));
	public ImageIcon brownTile = new ImageIcon(getClass().getResource("/brown.png"));
	public ImageIcon clockwise_cyanTile = new ImageIcon(getClass().getResource("/clockwise_cyan.png"));
	public ImageIcon counterClockwise_cyanTile = new ImageIcon(getClass().getResource("/counterClockwise_cyan.png"));
	public ImageIcon grayTile = new ImageIcon(getClass().getResource("/gray.png"));
	public ImageIcon greenTile = new ImageIcon(getClass().getResource("/green.png"));
	public ImageIcon ltgreenTile = new ImageIcon(getClass().getResource("/lightgreen.png"));
	public ImageIcon ltredTile = new ImageIcon(getClass().getResource("/lightred.png"));
	public ImageIcon orangeTile = new ImageIcon(getClass().getResource("/orange.png"));
	public ImageIcon pinkTile = new ImageIcon(getClass().getResource("/pink.png"));
	public ImageIcon pukeTile = new ImageIcon(getClass().getResource("/puke.png"));
	public ImageIcon purpleTile = new ImageIcon(getClass().getResource("/purple.png"));
	public ImageIcon redTile = new ImageIcon(getClass().getResource("/red.png"));
	public ImageIcon down_yellowTile = new ImageIcon(getClass().getResource("/down_yellow.png"));
	public ImageIcon left_yellowTile = new ImageIcon(getClass().getResource("/left_yellow.png"));
	public ImageIcon right_yellowTile = new ImageIcon(getClass().getResource("/right_yellow.png"));
	public ImageIcon up_yellowTile = new ImageIcon(getClass().getResource("/up_yellow.png"));
	public ImageIcon whiteTile = new ImageIcon(getClass().getResource("/white.png"));
	

	private int brush = 0;
	private JLabel currentBrush;

	public double portalPairCounter1 = 0;
	public double portalPairCounter2 = 0;
	public int counter1 = 0;
	public int counter2 = 0;

	final JFileChooser saveChooser = new JFileChooser();
	final JFileChooser loadChooser = new JFileChooser();
	public File file;
	public boolean loading = false;
	public boolean reseting = false;
	public boolean cleared = false;

	public MapEditor() {
		super("Map Editor");

		setLayout(new BorderLayout());

		Container map1Contain = new Container();
		map1Contain.setLayout(new GridLayout(ROWS, COLUMNS));
		map1Contain.setPreferredSize(dimension);
		add(map1Contain, BorderLayout.WEST);

		Container map2Contain = new Container();
		map2Contain.setLayout(new GridLayout(ROWS, COLUMNS));
		map2Contain.setPreferredSize(dimension);
		add(map2Contain, BorderLayout.EAST);

		JPanel palettePanel = new JPanel(new FlowLayout());
		Container paletteContain = new Container();
		paletteContain.setLayout(new GridLayout(7, 2));
		paletteContain.setPreferredSize(paletteDimesion);
		palettePanel.add(paletteContain);
		currentBrush = new JLabel(blackTile);
		currentBrush.setText("Box");
		
		JPanel centerPanel = new JPanel(new BorderLayout());
		centerPanel.add(palettePanel, BorderLayout.CENTER);
		centerPanel.add(currentBrush, BorderLayout.SOUTH);
		
		add(centerPanel, BorderLayout.CENTER);
		

		IOListener ioListener = new IOListener();

		JPanel IOPanel = new JPanel(new FlowLayout());
		save = new JButton("SAVE");
		save.addActionListener(ioListener);
		load = new JButton("LOAD");
		load.addActionListener(ioListener);
		clear = new JButton("CLEAR");
		clear.addActionListener(ioListener);
		IOPanel.add(save);
		IOPanel.add(load);
		IOPanel.add(clear);
		add(IOPanel, BorderLayout.SOUTH);

		MapListener mapListener = new MapListener();

		for (int x = 0; x < ROWS; x++) {
			for (int y = 0; y < COLUMNS; y++) {
				if (y == 0 || y == COLUMNS - 1 || x == 0 || x == ROWS - 1) {
					mapTiles1[y][x] = new MapTile(1, 1);
					map1Contain.add(mapTiles1[y][x]);
				} else {
					mapTiles1[y][x] = new MapTile(0, 1);
					mapTiles1[y][x].addActionListener(mapListener);
					map1Contain.add(mapTiles1[y][x]);
				}

				if (y == 0 || y == COLUMNS - 1 || x == 0 || x == ROWS - 1) {
					mapTiles2[y][x] = new MapTile(1, 2);
					map2Contain.add(mapTiles2[y][x]);
				} else {
					mapTiles2[y][x] = new MapTile(0, 2);
					mapTiles2[y][x].addActionListener(mapListener);
					map2Contain.add(mapTiles2[y][x]);
				}
			}
		}

		PaletteListener paletteListener = new PaletteListener();

		black = new MapTile(BOX);
		black.addActionListener(paletteListener);
		paletteContain.add(black);

		blue = new MapTile(BACKGROUND);
		blue.addActionListener(paletteListener);
		paletteContain.add(blue);

		brown = new MapTile(BALL_GATE);
		brown.addActionListener(paletteListener);
		paletteContain.add(brown);

		ccw_cyan = new MapTile(CCWBOUNCY_BOX);
		ccw_cyan.addActionListener(paletteListener);
		paletteContain.add(ccw_cyan);
		
		cw_cyan = new MapTile(CWBOUNCY_BOX);
		cw_cyan.addActionListener(paletteListener);
		paletteContain.add(cw_cyan);

		gray = new MapTile(TELEPORTER);
		gray.addActionListener(paletteListener);
		paletteContain.add(gray);

		green = new MapTile(PLAYER_2);
		green.addActionListener(paletteListener);
		paletteContain.add(green);

		lightgreen = new MapTile(PLAYER_BUTTON);
		lightgreen.addActionListener(paletteListener);
		paletteContain.add(lightgreen);

		lightred = new MapTile(BOX_BUTTON);
		lightred.addActionListener(paletteListener);
		paletteContain.add(lightred);

		orange = new MapTile(GOAL);
		orange.addActionListener(paletteListener);
		paletteContain.add(orange);

		pink = new MapTile(PLAYER_GATE);
		pink.addActionListener(paletteListener);
		paletteContain.add(pink);

		puke = new MapTile(BALL_BUTTON);
		puke.addActionListener(paletteListener);
		paletteContain.add(puke);

		purple = new MapTile(BALL);
		purple.addActionListener(paletteListener);
		paletteContain.add(purple);

		red = new MapTile(PLAYER_1);
		red.addActionListener(paletteListener);
		paletteContain.add(red);

		down_yellow = new MapTile(DOWN_MOVING_BOX);
		down_yellow.addActionListener(paletteListener);
		paletteContain.add(down_yellow);

		up_yellow = new MapTile(UP_MOVING_BOX);
		up_yellow.addActionListener(paletteListener);
		paletteContain.add(up_yellow);
		
		right_yellow = new MapTile(RIGHT_MOVING_BOX);
		right_yellow.addActionListener(paletteListener);
		paletteContain.add(right_yellow);
		
		left_yellow = new MapTile(LEFT_MOVING_BOX);
		left_yellow.addActionListener(paletteListener);
		paletteContain.add(left_yellow);
		
		white = new MapTile(PORTAL);
		white.addActionListener(paletteListener);
		paletteContain.add(white);

		saveChooser.setDialogTitle("Save");
		loadChooser.setDialogTitle("Load");
	}

	public static void main(String[] args) {
		mapEditor = new MapEditor();
		mapEditor.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		mapEditor.setSize(1000, 500);
		mapEditor.setResizable(false);
		mapEditor.setVisible(true);
	}

	private void clearMaps() {
		cleared = true;
		
		for (int x = 0; x < ROWS; x++) {
			for (int y = 0; y < COLUMNS; y++) {
				if (y == 0 || y == COLUMNS - 1 || x == 0 || x == ROWS - 1) {
					mapTiles1[y][x].setType(1);
				} else {
					mapTiles1[y][x].setType(0);
				}

				if (y == 0 || y == COLUMNS - 1 || x == 0 || x == ROWS - 1) {
					mapTiles2[y][x].setType(1);
				} else {
					mapTiles2[y][x].setType(0);
				}
			}
		}
	}

	private void setBrushPanel(){
		
		switch (brush) {
		case BACKGROUND:
			currentBrush.setIcon(blueTile);
			currentBrush.setText("Eraser");
			break;
		case BOX:
			currentBrush.setIcon(blackTile);
			currentBrush.setText("Box");
			break;
		case BALL_GATE:
			currentBrush.setIcon(brownTile);
			currentBrush.setText("Ball Gate");
			break;
		case CCWBOUNCY_BOX:
			currentBrush.setIcon(counterClockwise_cyanTile);
			currentBrush.setText("counterClockwise Bouncy Box");
			break;
		case CWBOUNCY_BOX:
			currentBrush.setIcon(clockwise_cyanTile);
			currentBrush.setText("clockwise Bouncy Box");
			break;
		case TELEPORTER:
			currentBrush.setIcon(grayTile);
			currentBrush.setText("Teleporter");
			break;
		case PLAYER_2:
			currentBrush.setIcon(greenTile);
			currentBrush.setText("Player 2");
			break;
		case PLAYER_BUTTON:
			currentBrush.setIcon(ltgreenTile);
			currentBrush.setText("Player Button");
			break;
		case BOX_BUTTON:
			currentBrush.setIcon(ltredTile);
			currentBrush.setText("Box Button");
			break;
		case GOAL:
			currentBrush.setIcon(orangeTile);
			currentBrush.setText("Goal");
			break;
		case PLAYER_GATE:
			currentBrush.setIcon(pinkTile);
			currentBrush.setText("Player Gate");
			break;
		case BALL_BUTTON:
			currentBrush.setIcon(pukeTile);
			currentBrush.setText("Ball Button");
			break;
		case BALL:
			currentBrush.setIcon(purpleTile);
			currentBrush.setText("Ball");
			break;
		case PLAYER_1:
			currentBrush.setIcon(redTile);
			currentBrush.setText("Player 1");
			break;
		case DOWN_MOVING_BOX:
			currentBrush.setIcon(down_yellowTile);
			currentBrush.setText("Down Moving Box");
			break;
		case UP_MOVING_BOX:
			currentBrush.setIcon(up_yellowTile);
			currentBrush.setText("Up Moving Box");
			break;
		case RIGHT_MOVING_BOX:
			currentBrush.setIcon(right_yellowTile);
			currentBrush.setText("Right Moving Box");
			break;
		case LEFT_MOVING_BOX:
			currentBrush.setIcon(left_yellowTile);
			currentBrush.setText("Left Moving Box");
			break;
		case PORTAL:
			currentBrush.setIcon(whiteTile);
			currentBrush.setText("Portal");
			break;
		}
		
	}

	private class PaletteListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			brush = (int)(Math.floor(((MapTile) e.getSource()).getType()));
			setBrushPanel();
		}
	}

	private class MapListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			((MapTile) e.getSource()).setType(brush);
		}
	}

	private class IOListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			if (((JButton) e.getSource()).equals(clear)) {
				int choice = JOptionPane.showConfirmDialog(mapEditor,
						"Are You sure?", "Clear Map",
						JOptionPane.OK_CANCEL_OPTION);
				if (choice == JOptionPane.OK_OPTION)
					clearMaps();
			}
			if (((JButton) e.getSource()).equals(save)) {
				int choice = saveChooser.showOpenDialog(mapEditor);
				if (choice == JFileChooser.APPROVE_OPTION) {
					file = saveChooser.getSelectedFile();

					String[][] output1 = new String[ROWS][COLUMNS];
					String[][] output2 = new String[ROWS][COLUMNS];
					for (int i = 0; i < ROWS; i++) {
						for (int j = 0; j < COLUMNS; j++) {
							if(Math.floor(mapTiles1[j][i].getType()) == 18)
								output1[j][i] = Double.toString(mapTiles1[j][i].getType());
							else
								output1[j][i] = Integer.toString((int)(mapTiles1[j][i].getType()));
							if(Math.floor(mapTiles2[j][i].getType()) == 18)
								output2[j][i] = Double.toString(mapTiles2[j][i].getType());
							else
								output2[j][i] = Integer.toString((int)(mapTiles2[j][i].getType()));
						}
					}

					try {
						if (!file.exists())
							file.createNewFile();
						PrintWriter out = new PrintWriter(new FileWriter(file));
						for (int i = 0; i < ROWS; i++) {
							for (int j = 0; j < COLUMNS; j++) {
								if (j == COLUMNS - 1) {
									out.print(output1[j][i]);
								} else
									out.print(output1[j][i] + ",");
							}
							out.println();
						}

						out.println();
						for (int x = 0; x < ROWS; x++) {
							for (int y = 0; y < COLUMNS; y++) {
								if (y == COLUMNS - 1) {
									out.print(output2[y][x]);
								} else
									out.print(output2[y][x] + ",");

							}
							out.println();
						}
						out.close();
					} catch (IOException e1) {
						e1.printStackTrace();
					}

				}
			}
			if (((JButton) e.getSource()).equals(load)) {
				int choice = loadChooser.showOpenDialog(mapEditor);
				if (choice == JFileChooser.APPROVE_OPTION) {
					file = loadChooser.getSelectedFile();

					String input;
					loading = true;
					try {
						input = readFile(file);

												
						Scanner scanner = new Scanner(input);
						scanner.useDelimiter(",");
						
						for (int i = 0; i < ROWS; i++) {
							for (int j = 0; j < COLUMNS; j++) {
								if(scanner.hasNextInt())
									mapTiles1[j][i].setType(scanner.nextInt());
								else if(scanner.hasNextDouble())
									mapTiles1[j][i].setType(scanner.nextDouble());
								else
									scanner.nextLine();
							}
						}
						scanner.nextLine();
						for (int i = 0; i < ROWS; i++) {
							for (int j = 0; j < COLUMNS; j++) {
								if(scanner.hasNextInt())
									mapTiles2[j][i].setType(scanner.nextInt());
								else if(scanner.hasNextDouble())
									mapTiles2[j][i].setType(scanner.nextDouble());
								else
									scanner.nextLine();
							}
						}
						scanner.close();
					} catch (IOException e1) {
						e1.printStackTrace();
					}
					loading = false;
				}
			}
		}
	}

	private String readFile(File file) throws IOException {

		StringBuilder fileContents = new StringBuilder((int) file.length());
		Scanner scanner = new Scanner(file);
		String lineSeparator = System.getProperty("line.separator");

		try {
			while (scanner.hasNextLine()) {
				fileContents.append(scanner.nextLine() + lineSeparator);
			}
			return fileContents.toString();
		} finally {
			scanner.close();
		}
	}
	
	private void renumberPortals(int map, double oldType){
		reseting = true;
		if(map == 1){
			for (int x = 1; x < ROWS - 1; x++) {
				for (int y = 1; y < COLUMNS - 1; y++) {
					if((int)(Math.floor(mapTiles1[y][x].getType())) == 18){
						if(mapTiles1[y][x].getType() > oldType){
							mapTiles1[y][x].setType(Math.round((mapTiles1[y][x].getType() - 0.001)*1000)/(double)1000);
							portalPairCounter1--;
							counter1 = 0;
						}
						else if(mapTiles1[y][x].getType() == oldType){
							mapTiles1[y][x].setType(BACKGROUND);
							counter1 = 0;
						}
					}
				}
			}
			
		}
		else if(map == 2){
			for (int x = 1; x < ROWS - 1; x++) {
				for (int y = 1; y < COLUMNS - 1; y++) {
					if((int)(Math.floor(mapTiles2[y][x].getType())) == 18){
						if(mapTiles2[y][x].getType() > oldType){
							mapTiles2[y][x].setType(Math.round((mapTiles2[y][x].getType() - 0.001)*1000)/(double)1000);
							portalPairCounter2--;
							counter2 = 0;
						}
						else if(mapTiles2[y][x].getType() == oldType){
							mapTiles2[y][x].setType(BACKGROUND);
							counter2 = 0;
						}
					}
				}
			}
			
		}
		reseting =  false;
	}

	private class MapTile extends JButton {
		
		private double type;
		private int map;

		public MapTile(double type) {
			this.type = type;
			setType(type);
		}

		public MapTile(double type, int map) {
			this.type = type;
			this.map = map;
			setType(type);
		}
		

		public void setType(double type) {
			if(reseting){
				this.type = type;
				if(type == 0)
					setIcon(blueTile);
				else
					setIcon(whiteTile);
			}
			else{
				//if what you click already is a portal, renumber the portals placed
				if((int)(Math.floor(this.type)) == 18)
					renumberPortals(this.map, this.type);
				
				this.type = type;

				switch ((int)(Math.floor(type))) {
				case 1:
					setIcon(blackTile);
					break;
				case 0:
					setIcon(blueTile);
					break;
				case 2:
					setIcon(brownTile);
					break;
				case 3:
					setIcon(counterClockwise_cyanTile);
					break;
				case 4:
					setIcon(clockwise_cyanTile);
					break;
				case 5:
					setIcon(grayTile);
					break;
				case 6:
					setIcon(greenTile);
					break;
				case 7:
					setIcon(ltgreenTile);
					break;
				case 8:
					setIcon(ltredTile);
					break;
				case 9:
					setIcon(orangeTile);
					break;
				case 10:
					setIcon(pinkTile);
					break;
				case 11:
					setIcon(pukeTile);
					break;
				case 12:
					setIcon(purpleTile);
					break;
				case 13:
					setIcon(redTile);
					break;
				case 14:
					setIcon(down_yellowTile);
					break;
				case 15:
					setIcon(up_yellowTile);
					break;
				case 16:
					setIcon(right_yellowTile);
					break;
				case 17:
					setIcon(left_yellowTile);
					break;
				case 18:
					setIcon(whiteTile);
					if(cleared){
						portalPairCounter1 = 0;
						counter1 = 0;
						portalPairCounter2 = 0;
						counter2 = 0;
						cleared = false;
					}
					if(this.map == 1){
						if(!loading)
							this.type = this.type + (portalPairCounter1 * (0.001));
						counter1++;
						if(counter1 == 2){
							counter1 = 0;
							portalPairCounter1++;
						}
					}
					else if(this.map == 2){
						if(!loading)
							this.type = this.type + (portalPairCounter2 * (0.001));
						counter2++;
						if(counter2 == 2){
							counter2 = 0;
							portalPairCounter2++;
						}
					}
					break;
				}
			}
		}
		

		public double getType() {
			return type;
		}
	}
}
